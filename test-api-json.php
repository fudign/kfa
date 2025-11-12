<?php

require __DIR__ . '/kfa-backend/kfa-api/vendor/autoload.php';

$app = require_once __DIR__ . '/kfa-backend/kfa-api/bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

use App\Models\News;
use App\Http\Resources\NewsResource;
use Illuminate\Http\Request;

// Simulate what the API returns
$news = News::with(['author:id,name,email', 'featuredImage'])->paginate(2);
$collection = NewsResource::collection($news);

// Convert to array (what gets sent as JSON)
$response = $collection->response(new Request())->getData(true);

echo "=== Actual JSON Response (First 2 News Items) ===\n\n";
echo json_encode($response, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
