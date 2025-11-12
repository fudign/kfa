/**
 * Supabase Auth Helper
 * Provides authentication functions using Supabase Auth
 * Replaces Laravel API auth to avoid CORS issues
 */

import { supabase } from './supabase'

export interface User {
  id: string
  email: string
  name: string
  avatar_url?: string
  role: 'admin' | 'editor' | 'moderator' | 'member' | 'guest'
  roles: string[]
  permissions: string[]
}

export interface AuthResponse {
  user: User
  token: string
}

/**
 * Sign up new user
 */
export async function signUp(data: {
  email: string
  password: string
  name: string
}): Promise<AuthResponse> {
  try {
    // 1. Create user in Supabase Auth
    const { data: authData, error: signUpError } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: {
          name: data.name,
        },
      },
    })

    if (signUpError) throw signUpError
    if (!authData.user) throw new Error('User creation failed')

    // 2. Get access token
    const token = authData.session?.access_token || ''

    // 3. Get profile from profiles table (created automatically by trigger)
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', authData.user.id)
      .single()

    if (profileError) {
      console.error('Profile fetch error:', profileError)
      // If profile doesn't exist yet, return basic user data
      return {
        user: {
          id: authData.user.id,
          email: authData.user.email!,
          name: data.name,
          role: 'member',
          roles: ['member'],
          permissions: [],
        },
        token,
      }
    }

    return {
      user: {
        id: profile.id,
        email: profile.email,
        name: profile.name || data.name,
        avatar_url: profile.avatar_url,
        role: profile.role,
        roles: profile.roles || ['member'],
        permissions: profile.permissions || [],
      },
      token,
    }
  } catch (error: any) {
    console.error('Sign up error:', error)
    throw new Error(error.message || 'Registration failed')
  }
}

/**
 * Sign in with email and password
 */
export async function signIn(credentials: {
  email: string
  password: string
}): Promise<AuthResponse> {
  try {
    // 1. Sign in via Supabase Auth
    const { data: authData, error: signInError } =
      await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password,
      })

    if (signInError) throw signInError
    if (!authData.user) throw new Error('Login failed')

    // 2. Get access token
    const token = authData.session?.access_token || ''

    // 3. Get profile from profiles table
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', authData.user.id)
      .single()

    if (profileError) {
      console.error('Profile fetch error:', profileError)
      // Return basic user data if profile doesn't exist
      return {
        user: {
          id: authData.user.id,
          email: authData.user.email!,
          name: authData.user.email!,
          role: 'member',
          roles: ['member'],
          permissions: [],
        },
        token,
      }
    }

    return {
      user: {
        id: profile.id,
        email: profile.email,
        name: profile.name,
        avatar_url: profile.avatar_url,
        role: profile.role,
        roles: profile.roles || ['member'],
        permissions: profile.permissions || [],
      },
      token,
    }
  } catch (error: any) {
    console.error('Sign in error:', error)
    throw new Error(error.message || 'Invalid email or password')
  }
}

/**
 * Sign out current user
 */
export async function signOut(): Promise<void> {
  try {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  } catch (error: any) {
    console.error('Sign out error:', error)
    throw new Error(error.message || 'Logout failed')
  }
}

/**
 * Get current user
 */
export async function getCurrentUser(): Promise<User | null> {
  try {
    // 1. Get current session
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession()

    if (sessionError) throw sessionError
    if (!session?.user) return null

    // 2. Get profile from profiles table
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', session.user.id)
      .single()

    if (profileError) {
      console.error('Profile fetch error:', profileError)
      return null
    }

    return {
      id: profile.id,
      email: profile.email,
      name: profile.name,
      avatar_url: profile.avatar_url,
      role: profile.role,
      roles: profile.roles || ['member'],
      permissions: profile.permissions || [],
    }
  } catch (error: any) {
    console.error('Get current user error:', error)
    return null
  }
}

/**
 * Update user profile
 */
export async function updateProfile(data: {
  name?: string
  avatar_url?: string
}): Promise<User> {
  try {
    // 1. Get current user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError) throw userError
    if (!user) throw new Error('Not authenticated')

    // 2. Update profile
    const { data: profile, error: updateError } = await supabase
      .from('profiles')
      .update(data)
      .eq('id', user.id)
      .select()
      .single()

    if (updateError) throw updateError

    return {
      id: profile.id,
      email: profile.email,
      name: profile.name,
      avatar_url: profile.avatar_url,
      role: profile.role,
      roles: profile.roles || ['member'],
      permissions: profile.permissions || [],
    }
  } catch (error: any) {
    console.error('Update profile error:', error)
    throw new Error(error.message || 'Profile update failed')
  }
}

/**
 * Reset password (send email)
 */
export async function resetPassword(email: string): Promise<void> {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    })

    if (error) throw error
  } catch (error: any) {
    console.error('Reset password error:', error)
    throw new Error(error.message || 'Password reset failed')
  }
}

/**
 * Update password (after reset)
 */
export async function updatePassword(newPassword: string): Promise<void> {
  try {
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    })

    if (error) throw error
  } catch (error: any) {
    console.error('Update password error:', error)
    throw new Error(error.message || 'Password update failed')
  }
}

/**
 * Check if user has specific role
 */
export async function hasRole(role: string): Promise<boolean> {
  try {
    const user = await getCurrentUser()
    if (!user) return false
    return user.roles.includes(role)
  } catch {
    return false
  }
}

/**
 * Check if user has any of the specified roles
 */
export async function hasAnyRole(roles: string[]): Promise<boolean> {
  try {
    const user = await getCurrentUser()
    if (!user) return false
    return roles.some((role) => user.roles.includes(role))
  } catch {
    return false
  }
}

/**
 * Check if user has specific permission
 */
export async function hasPermission(permission: string): Promise<boolean> {
  try {
    const user = await getCurrentUser()
    if (!user) return false
    return user.permissions.includes(permission)
  } catch {
    return false
  }
}

/**
 * Listen to auth state changes
 */
export function onAuthStateChange(
  callback: (user: User | null) => void
): () => void {
  const {
    data: { subscription },
  } = supabase.auth.onAuthStateChange(async (event, session) => {
    console.log('Auth state changed:', event, session?.user?.email)

    if (session?.user) {
      // Get full profile when user signs in
      const user = await getCurrentUser()
      callback(user)
    } else {
      callback(null)
    }
  })

  // Return unsubscribe function
  return () => {
    subscription.unsubscribe()
  }
}

/**
 * Create test accounts (admin, editor, moderator, member)
 * Only for development!
 */
export async function createTestAccounts(): Promise<void> {
  const testAccounts = [
    { email: 'admin@kfa.kg', password: 'password', name: 'Admin User', role: 'admin', roles: ['admin', 'editor', 'moderator', 'member'] },
    { email: 'editor@kfa.kg', password: 'password', name: 'Editor User', role: 'editor', roles: ['editor', 'member'] },
    { email: 'moderator@kfa.kg', password: 'password', name: 'Moderator User', role: 'moderator', roles: ['moderator', 'member'] },
    { email: 'member@kfa.kg', password: 'password', name: 'Member User', role: 'member', roles: ['member'] },
  ]

  console.log('Creating test accounts...')

  for (const account of testAccounts) {
    try {
      // Try to sign up
      await signUp({
        email: account.email,
        password: account.password,
        name: account.name,
      })

      // Update role in profiles table
      const { data: userData } = await supabase.auth.signInWithPassword({
        email: account.email,
        password: account.password,
      })

      if (userData.user) {
        await supabase
          .from('profiles')
          .update({ role: account.role, roles: account.roles })
          .eq('id', userData.user.id)

        console.log(`✅ Created ${account.role}: ${account.email}`)
      }

      // Sign out
      await signOut()
    } catch (error) {
      console.log(`⚠️ ${account.email} already exists or error:`, error)
    }
  }

  console.log('Test accounts setup complete!')
}
