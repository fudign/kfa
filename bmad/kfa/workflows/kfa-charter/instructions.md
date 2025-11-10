# Инструкции по генерации устава КФА

<critical>Воркфлоу выполняется согласно: {project-root}/bmad/core/tasks/workflow.xml</critical>
<critical>Конфигурация загружена из: {project-root}/bmad/kfa/workflows/kfa-charter/workflow.yaml</critical>
<critical>Все ответы должны быть на русском языке</critical>

<workflow>

<step n="1" goal="Общие сведения об организации">

<ask>Укажите полное наименование организации на русском языке:</ask>
<action>Сохранить в {{organization_full_name}}</action>

<ask>Укажите сокращенное наименование (аббревиатуру):</ask>
<action>Сохранить в {{organization_short_name}}</action>

<ask>Укажите наименование на кыргызском языке:</ask>
<action>Сохранить в {{organization_name_kyrgyz}}</action>

<ask>Укажите наименование на английском языке:</ask>
<action>Сохранить в {{organization_name_english}}</action>

<template-output>organization_full_name</template-output>
<template-output>organization_short_name</template-output>
<template-output>organization_name_kyrgyz</template-output>
<template-output>organization_name_english</template-output>

</step>

<step n="2" goal="Организационно-правовая форма и статус">

<ask>Выберите организационно-правовую форму:

1. Финансовый кооператив (коммерческая организация)
2. Финансовый кооператив (некоммерческая организация)
3. Ассоциация (союз) профессиональных участников рынка
4. Саморегулируемая организация
   </ask>

<action>На основе выбора сформировать {{legal_form_description}}</action>

<ask>Является ли организация коммерческой? [да/нет]</ask>
<action>Сохранить в {{commercial_or_noncommercial}}</action>

<template-output>legal_form_description</template-output>
<template-output>commercial_or_noncommercial</template-output>

</step>

<step n="3" goal="Адреса и местонахождение">

<ask>Город местонахождения организации:</ask>
<action>Сохранить в {{organization_city}}</action>

<ask>Юридический адрес (полный):</ask>
<action>Сохранить в {{organization_legal_address}}</action>

<ask>Почтовый адрес (если отличается от юридического):</ask>
<action>Сохранить в {{organization_postal_address}}</action>

<ask>Фактический адрес (если отличается):</ask>
<action>Сохранить в {{organization_actual_address}}</action>

<template-output>organization_city</template-output>
<template-output>organization_legal_address</template-output>
<template-output>organization_postal_address</template-output>
<template-output>organization_actual_address</template-output>

</step>

<step n="4" goal="Регистрационные данные">

<ask>Номер протокола общего собрания учредителей:</ask>
<action>Сохранить в {{founding_protocol_number}}</action>

<ask>Дата проведения учредительного собрания (дд.мм.гггг):</ask>
<action>Сохранить в {{founding_date}}</action>

<template-output>founding_protocol_number</template-output>
<template-output>founding_date</template-output>

</step>

<step n="5" goal="Цели и задачи организации">

<ask>Укажите основные цели создания организации (минимум 3, максимум 7):
Например:

- Защита интересов профессиональных участников рынка ценных бумаг
- Содействие развитию рынка ценных бумаг КР
- Обеспечение прозрачности и добросовестности на рынке
  </ask>

<action>Сформировать нумерованный список для {{goals_list}}</action>

<template-output>goals_list</template-output>

<ask>Укажите основные задачи организации (минимум 5, максимум 10):
Например:

- Разработка стандартов профессиональной деятельности
- Организация обучения и повышения квалификации
- Представление интересов членов в государственных органах
  </ask>

<action>Сформировать нумерованный список для {{tasks_list}}</action>

<template-output>tasks_list</template-output>

</step>

<step n="6" goal="Предмет и виды деятельности">

<ask>Укажите предмет деятельности организации (3-5 основных направлений):
Например:

- Саморегулирование деятельности профессиональных участников
- Методическое обеспечение участников рынка
- Взаимодействие с регуляторами
  </ask>

<action>Сформировать нумерованный список для {{activities_list}}</action>

<template-output>activities_list</template-output>

<ask>Укажите конкретные виды деятельности (5-15 позиций):
Например:

- Разработка правил и стандартов профессиональной деятельности
- Организация и проведение квалификационных экзаменов
- Ведение реестра членов организации
- Аналитическая и исследовательская деятельность
- Организация конференций, семинаров, обучающих мероприятий
  </ask>

<action>Сформировать нумерованный список для {{business_activities_list}}</action>

<template-output>business_activities_list</template-output>

</step>

<step n="7" goal="Взаимодействие с регуляторами">

<ask>Укажите государственные органы, с которыми взаимодействует организация:
Выберите несколько вариантов (через запятую):

1. Национальный банк Кыргызской Республики
2. Государственная служба регулирования и надзора за финансовым рынком
3. Министерство экономики и коммерции КР
4. Министерство юстиции КР
5. Другие (укажите)
   </ask>

<action>Сформировать список для {{regulatory_bodies_list}}</action>

<template-output>regulatory_bodies_list</template-output>

</step>

<step n="8" goal="Членство - критерии и категории">

<ask>Кто может быть членом организации?
Выберите варианты (можно несколько):

1. Юридические лица - профессиональные участники рынка ценных бумаг
2. Индивидуальные предприниматели
3. Физические лица - специалисты рынка ценных бумаг
4. Другие категории (укажите)
   </ask>

<action>Сформировать описание для {{membership_eligibility}}</action>

<template-output>membership_eligibility</template-output>

<ask>Минимальное количество членов организации (по закону не менее 3):</ask>
<action>Сохранить в {{minimum_members}}</action>

<template-output>minimum_members</template-output>

<ask>Есть ли категории членства?

1. Действительные члены
2. Ассоциированные члены
3. Почетные члены
4. Нет категорий
   </ask>

<action>Сформировать список категорий для {{membership_categories}}</action>

<template-output>membership_categories</template-output>

</step>

<step n="9" goal="Порядок приема в члены">

<ask>Какие документы требуются для приема в члены?
Выберите (можно несколько):

1. Заявление о вступлении
2. Копия учредительных документов (для юр. лиц)
3. Копия лицензии на осуществление деятельности на рынке ценных бумаг
4. Рекомендации от действующих членов
5. Другие документы (укажите)
   </ask>

<action>Сформировать список для {{membership_application_requirements}}</action>

<template-output>membership_application_requirements</template-output>

<ask>Кто принимает решение о приеме в члены?

1. Общее собрание членов
2. Совет (Правление) организации
3. Исполнительный орган
   </ask>

<action>Сохранить в {{membership_decision_body}}</action>

<template-output>membership_decision_body</template-output>

<ask>Срок рассмотрения заявления о вступлении:

1. В течение 30 дней
2. В течение 60 дней
3. На ближайшем заседании уполномоченного органа
4. Другой срок (укажите)
   </ask>

<action>Сохранить в {{membership_decision_period}}</action>

<template-output>membership_decision_period</template-output>

<ask>Членство возникает с момента:

1. Принятия положительного решения о приеме
2. Внесения паевого взноса
3. Внесения записи в реестр членов
4. Подписания договора о членстве
   </ask>

<action>Сохранить в {{membership_start_condition}}</action>

<template-output>membership_start_condition</template-output>

</step>

<step n="10" goal="Права и обязанности членов">

<ask>Укажите основные права членов организации (минимум 8, максимум 15):
Стандартные права (можно дополнить):

- Участвовать в управлении организацией
- Избирать и быть избранным в органы управления
- Получать информацию о деятельности организации
- Пользоваться услугами организации
- Вносить предложения по улучшению деятельности
- Участвовать в распределении прибыли
- Выйти из организации в любое время
- Обжаловать решения органов управления
  </ask>

<action>Сформировать нумерованный список для {{member_rights_list}}</action>

<template-output>member_rights_list</template-output>

<ask>Укажите обязанности членов организации (минимум 8, максимум 15):
Стандартные обязанности (можно дополнить):

- Соблюдать устав и внутренние документы организации
- Своевременно вносить паевые и иные взносы
- Соблюдать стандарты профессиональной деятельности
- Участвовать в деятельности организации
- Не разглашать конфиденциальную информацию
- Нести субсидиарную ответственность (если предусмотрено)
- Предоставлять отчетность организации
- Информировать об изменениях в своей деятельности
  </ask>

<action>Сформировать нумерованный список для {{member_obligations_list}}</action>

<template-output>member_obligations_list</template-output>

</step>

<step n="11" goal="Прекращение членства">

<ask>Укажите основания прекращения членства (минимум 5):
Стандартные основания (можно дополнить):

- Добровольный выход
- Исключение за нарушение устава
- Ликвидация юридического лица-члена
- Смерть физического лица-члена
- Невнесение паевых взносов более установленного срока
- Систематическое нарушение профессиональных стандартов
- Утрата лицензии на осуществление деятельности
  </ask>

<action>Сформировать нумерованный список для {{membership_termination_cases}}</action>

<template-output>membership_termination_cases</template-output>

<ask>Что выплачивается при выходе из организации?

1. Паевой взнос в полном объеме
2. Паевой взнос за вычетом убытков
3. Пропорциональная доля имущества
4. Ничего не выплачивается
5. Другое (укажите)
   </ask>

<action>Сохранить описание в {{exit_payment_description}}</action>

<template-output>exit_payment_description</template-output>

</step>

<step n="12" goal="Имущество и паевые взносы">

<ask>Из чего формируется имущество организации?
Выберите источники (можно несколько):

1. Паевые взносы членов
2. Вступительные взносы
3. Доходы от оказания услуг
4. Гранты и пожертвования
5. Дивиденды от инвестиций
6. Иные не запрещенные законом источники
   </ask>

<action>Сформировать список для {{property_sources_list}}</action>

<template-output>property_sources_list</template-output>

<ask>Размер паевого взноса (в сомах):</ask>
<action>Сохранить в {{membership_fee_amount}}</action>

<template-output>membership_fee_amount</template-output>

<ask>Минимальный размер паевого взноса (в сомах):</ask>
<action>Сохранить в {{minimum_membership_fee}}</action>

<template-output>minimum_membership_fee</template-output>

<ask>Максимальный размер паевого взноса (в сомах или "не ограничен"):</ask>
<action>Сохранить в {{maximum_membership_fee}}</action>

<template-output>maximum_membership_fee</template-output>

<ask>График внесения паевого взноса:

1. Единовременно при вступлении
2. Ежегодно
3. Ежеквартально
4. Ежемесячно
5. По решению Общего собрания
   </ask>

<action>Сохранить в {{payment_schedule}}</action>

<template-output>payment_schedule</template-output>

<ask>Опишите порядок внесения паевых взносов (способы оплаты, сроки, последствия неуплаты):</ask>
<action>Сформировать описание для {{payment_procedure}}</action>

<template-output>payment_procedure</template-output>

</step>

<step n="13" goal="Вступительные взносы">

<ask>Размер вступительного взноса (в сомах или "не предусмотрен"):</ask>
<action>Сохранить в {{entry_fee_amount}}</action>

<template-output>entry_fee_amount</template-output>

<ask>Описание вступительного взноса (если есть):</ask>
<action>Сохранить в {{entry_fee_description}}</action>

<template-output>entry_fee_description</template-output>

</step>

<step n="14" goal="Резервный фонд (ОБЯЗАТЕЛЬНО ПО ЗАКОНУ!)">

<critical>По Закону КР "О кооперативах" создание резервного фонда обязательно!</critical>

<ask>Размер резервного фонда (процент от имущества или фиксированная сумма):
Рекомендация: не менее 10% от имущества кооператива
Пример: "10% от суммы паевых взносов" или "500 000 сомов"
</ask>

<action>Сохранить в {{reserve_fund_size}}</action>

<template-output>reserve_fund_size</template-output>

<ask>Источники формирования резервного фонда:
Выберите (можно несколько):

1. Отчисления от прибыли (укажите процент)
2. Целевые взносы членов
3. Штрафы и пени
4. Добровольные взносы
5. Другие источники (укажите)
   </ask>

<action>Сформировать список для {{reserve_fund_sources}}</action>

<template-output>reserve_fund_sources</template-output>

<ask>Цели использования резервного фонда:
Выберите (можно несколько):

1. Покрытие убытков
2. Непредвиденные расходы
3. Развитие организации
4. Поддержка членов в кризисных ситуациях
5. Другие цели (укажите)
   </ask>

<action>Сформировать список для {{reserve_fund_purposes}}</action>

<template-output>reserve_fund_purposes</template-output>

</step>

<step n="15" goal="Другие фонды">

<ask>Создаются ли другие фонды?
Примеры:

1. Фонд развития
2. Социальный фонд
3. Фонд обучения и развития кадров
4. Инвестиционный фонд
5. Не создаются дополнительные фонды
   </ask>

<action>Сформировать список для {{other_funds_list}}</action>

<template-output>other_funds_list</template-output>

</step>

<step n="16" goal="Распределение доходов">

<ask>Как распределяются доходы организации?
Укажите порядок распределения (пример):

- 10% - в резервный фонд
- 20% - на развитие организации
- 15% - на социальные программы для членов
- 15% - на обучение и повышение квалификации
- 40% - распределение между членами пропорционально паевым взносам
  </ask>

<action>Сформировать описание для {{income_distribution}}</action>

<template-output>income_distribution</template-output>

<ask>Кто определяет порядок распределения прибыли?

1. Общее собрание членов
2. Совет (Правление)
3. Исполнительный орган по согласованию с Советом
   </ask>

<action>Сохранить в {{profit_distribution_body}}</action>

<template-output>profit_distribution_body</template-output>

</step>

<step n="17" goal="Структура органов управления">

<ask>Название коллегиального органа управления (между собраниями):

1. Совет
2. Правление
3. Совет директоров
4. Наблюдательный совет
5. Другое (укажите)
   </ask>

<action>Сохранить в {{governance_council_name}}</action>

<template-output>governance_council_name</template-output>

<ask>Название исполнительного органа:

1. Председатель
2. Генеральный директор
3. Исполнительный директор
4. Правление (коллегиальный орган)
5. Другое (укажите)
   </ask>

<action>Сохранить в {{executive_body_name}}</action>

<template-output>executive_body_name</template-output>

<ask>Исполнительный орган является:

1. Единоличным (Председатель, Директор)
2. Коллегиальным (Правление)
   </ask>

<action>Сохранить описание в {{executive_body_type_description}}</action>

<template-output>executive_body_type_description</template-output>

<ask>Название контрольного органа:

1. Ревизионная комиссия
2. Контрольно-ревизионная комиссия
3. Аудиторская комиссия
4. Другое (укажите)
   </ask>

<action>Сохранить в {{audit_body_name}}</action>

<template-output>audit_body_name</template-output>

</step>

<step n="18" goal="Общее собрание членов">

<ask>Частота проведения очередного Общего собрания:

1. Не реже одного раза в год
2. Два раза в год
3. Ежеквартально
4. Другая периодичность (укажите)
   </ask>

<action>Сохранить в {{regular_meeting_frequency}}</action>

<template-output>regular_meeting_frequency</template-output>

<ask>Внеочередное Общее собрание созывается по инициативе:
Выберите (можно несколько):

1. Совета (Правления)
2. Исполнительного органа
3. Ревизионной комиссии
4. Не менее 1/3 членов организации
5. Не менее 10% членов организации
6. Другое (укажите)
   </ask>

<action>Сформировать список для {{extraordinary_meeting_initiation}}</action>

<template-output>extraordinary_meeting_initiation</template-output>

<ask>Кворум для Общего собрания:

1. 50% + 1 голос членов
2. 2/3 членов
3. 75% членов
4. Другое (укажите процент)
   </ask>

<action>Сохранить в {{quorum_general_meeting}}</action>

<template-output>quorum_general_meeting</template-output>

<ask>Квалифицированное большинство для важных решений (изменение устава, реорганизация, ликвидация):

1. 2/3 голосов присутствующих
2. 3/4 голосов присутствующих
3. Единогласно
4. Другое (укажите)
   </ask>

<action>Сохранить в {{supermajority_percentage}}</action>

<template-output>supermajority_percentage</template-output>

<ask>Простое большинство для обычных решений:

1. 50% + 1 голос
2. Более половины голосов
3. Другое (укажите)
   </ask>

<action>Сохранить в {{simple_majority_percentage}}</action>

<template-output>simple_majority_percentage</template-output>

</step>

<step n="19" goal="Совет (Правление) организации">

<ask>Количество членов Совета:
Укажите число (рекомендуется 5-11 человек для эффективной работы):
</ask>

<action>Сохранить в {{council_members_count}}</action>

<template-output>council_members_count</template-output>

<ask>Срок полномочий Совета:

1. 1 год
2. 2 года
3. 3 года
4. 5 лет
5. До переизбрания
   </ask>

<action>Сохранить в {{council_term}}</action>

<template-output>council_term</template-output>

<ask>Частота заседаний Совета:

1. Не реже одного раза в месяц
2. Не реже одного раза в квартал
3. Не реже одного раза в полугодие
4. По мере необходимости
   </ask>

<action>Сохранить в {{council_meeting_frequency}}</action>

<template-output>council_meeting_frequency</template-output>

<ask>Кворум для заседания Совета:

1. Простое большинство (более 50%)
2. 2/3 членов Совета
3. Все члены Совета
4. Другое (укажите)
   </ask>

<action>Сохранить в {{council_quorum}}</action>

<template-output>council_quorum</template-output>

<ask>Порядок принятия решений Советом:

1. Простым большинством голосов
2. Квалифицированным большинством (2/3)
3. Единогласно
4. Другое (укажите)
   </ask>

<action>Сохранить в {{council_voting_rule}}</action>

<template-output>council_voting_rule</template-output>

</step>

<step n="20" goal="Исполнительный орган">

<ask>Как избирается/назначается исполнительный орган?

1. Избирается Общим собранием членов
2. Назначается Советом (Правлением)
3. Избирается Общим собранием по представлению Совета
4. Другое (укажите)
   </ask>

<action>Сохранить в {{executive_appointment_process}}</action>

<template-output>executive_appointment_process</template-output>

<ask>Срок полномочий исполнительного органа:

1. 1 год
2. 3 года
3. 5 лет
4. Бессрочно (до освобождения от должности)
5. Другое (укажите)
   </ask>

<action>Сохранить в {{executive_term}}</action>

<template-output>executive_term</template-output>

<ask>Кому подотчетен исполнительный орган?

1. Общему собранию членов
2. Совету (Правлению)
3. Общему собранию и Совету
   </ask>

<action>Сохранить в {{executive_accountability}}</action>

<template-output>executive_accountability</template-output>

</step>

<step n="21" goal="Компетенция Общего собрания">

<ask>Укажите вопросы исключительной компетенции Общего собрания (минимум 10):
Стандартные вопросы (можно дополнить):

- Внесение изменений в устав
- Избрание Совета (Правления)
- Избрание Ревизионной комиссии
- Избрание/освобождение исполнительного органа
- Утверждение годового отчета и баланса
- Утверждение финансового плана (бюджета)
- Распределение прибыли и убытков
- Определение размера паевых взносов
- Принятие решения о реорганизации
- Принятие решения о ликвидации
- Утверждение внутренних документов
- Определение приоритетных направлений деятельности
  </ask>

<action>Сформировать нумерованный список для {{general_meeting_powers}}</action>

<template-output>general_meeting_powers</template-output>

</step>

<step n="22" goal="Компетенция Совета (Правления)">

<ask>Укажите вопросы компетенции Совета (минимум 10):
Примеры:

- Организация выполнения решений Общего собрания
- Утверждение внутренних положений и регламентов
- Определение организационной структуры
- Прием и исключение членов
- Контроль деятельности исполнительного органа
- Подготовка повестки Общего собрания
- Подготовка годового отчета и финансовых документов
- Создание рабочих органов и комитетов
- Одобрение крупных сделок
- Утверждение штатного расписания
  </ask>

<action>Сформировать нумерованный список для {{council_powers}}</action>

<template-output>council_powers</template-output>

</step>

<step n="23" goal="Компетенция исполнительного органа">

<ask>Укажите полномочия исполнительного органа (минимум 10):
Примеры:

- Руководство текущей деятельностью организации
- Представление организации без доверенности
- Распоряжение имуществом в пределах утвержденного бюджета
- Заключение договоров и соглашений
- Прием и увольнение работников
- Открытие и закрытие счетов в банках
- Обеспечение ведения бухгалтерского учета
- Подготовка отчетности
- Организация исполнения решений Общего собрания и Совета
- Издание приказов и распоряжений
  </ask>

<action>Сформировать нумерованный список для {{executive_powers}}</action>

<template-output>executive_powers</template-output>

</step>

<step n="24" goal="Ревизионная комиссия">

<ask>Количество членов Ревизионной комиссии:
Рекомендуется: 3-5 человек (нечетное число)
</ask>

<action>Сохранить в {{audit_members_count}}</action>

<template-output>audit_members_count</template-output>

<ask>Срок полномочий Ревизионной комиссии:

1. 1 год
2. 2 года
3. 3 года
4. Совпадает со сроком полномочий Совета
   </ask>

<action>Сохранить в {{audit_term}}</action>

<template-output>audit_term</template-output>

<ask>Укажите полномочия Ревизионной комиссии (минимум 7):
Стандартные полномочия (можно дополнить):

- Проверка финансово-хозяйственной деятельности
- Проверка соблюдения законодательства и устава
- Проверка правильности ведения бухгалтерского учета
- Подготовка заключения по годовому отчету
- Требование созыва внеочередного Общего собрания
- Проверка законности решений органов управления
- Представление отчета Общему собранию
  </ask>

<action>Сформировать нумерованный список для {{audit_powers}}</action>

<template-output>audit_powers</template-output>

</step>

<step n="25" goal="Внешний аудит">

<ask>Обязателен ли внешний аудит для организации?

1. Обязателен ежегодно
2. Обязателен при определенных условиях (укажите)
3. Проводится по решению Общего собрания
4. Не предусмотрен
   </ask>

<action>Сохранить описание в {{external_audit_requirement}}</action>

<template-output>external_audit_requirement</template-output>

<ask>Кто выбирает аудиторскую организацию?

1. Общее собрание членов
2. Совет (Правление)
3. Ревизионная комиссия
4. Другой порядок (укажите)
   </ask>

<action>Сохранить в {{audit_selection_process}}</action>

<template-output>audit_selection_process</template-output>

<ask>Частота проведения аудита:

1. Ежегодно
2. Раз в 2 года
3. По решению Общего собрания
4. Другое (укажите)
   </ask>

<action>Сохранить в {{audit_frequency}}</action>

<template-output>audit_frequency</template-output>

</step>

<step n="26" goal="Реорганизация">

<ask>Укажите возможные формы реорганизации:
Выберите (можно несколько):

1. Слияние с другой организацией
2. Присоединение к другой организации
3. Разделение на несколько организаций
4. Выделение из состава организации
5. Преобразование в иную организационно-правовую форму
   </ask>

<action>Сформировать список для {{reorganization_forms}}</action>

<template-output>reorganization_forms</template-output>

<ask>Кто принимает решение о реорганизации?

1. Общее собрание квалифицированным большинством
2. Общее собрание единогласно
3. Другой порядок (укажите)
   </ask>

<action>Сохранить в {{reorganization_decision_body}}</action>

<template-output>reorganization_decision_body</template-output>

</step>

<step n="27" goal="Ликвидация">

<ask>Укажите основания для ликвидации организации (минимум 5):
Стандартные основания:

- Решение Общего собрания членов
- Истечение срока, на который создана организация
- Достижение целей, для которых создана организация
- Признание организации несостоятельной (банкротом)
- Решение суда
- Число членов стало меньше установленного законом минимума
- Аннулирование лицензии (если деятельность подлежит лицензированию)
  </ask>

<action>Сформировать список для {{liquidation_grounds}}</action>

<template-output>liquidation_grounds</template-output>

<ask>Кто принимает решение о добровольной ликвидации?

1. Общее собрание квалифицированным большинством (2/3)
2. Общее собрание квалифицированным большинством (3/4)
3. Общее собрание единогласно
   </ask>

<action>Сохранить в {{liquidation_decision_body}}</action>

<template-output>liquidation_decision_body</template-output>

<ask>Опишите порядок ликвидации (3-5 основных этапов):
Примерная последовательность:

1. Назначение ликвидационной комиссии
2. Уведомление кредиторов и публикация объявления
3. Инвентаризация и оценка имущества
4. Расчеты с кредиторами в установленной очередности
5. Составление ликвидационного баланса
6. Распределение оставшегося имущества
   </ask>

<action>Сформировать описание для {{liquidation_procedure}}</action>

<template-output>liquidation_procedure</template-output>

<ask>Как распределяется оставшееся имущество после ликвидации?

1. Пропорционально паевым взносам членов
2. Поровну между всеми членами
3. Направляется на цели, предусмотренные уставом
4. Передается в государственную собственность
5. Другой порядок (укажите)
   </ask>

<action>Сохранить в {{remaining_assets_distribution}}</action>

<template-output>remaining_assets_distribution</template-output>

</step>

<step n="28" goal="Изменение устава">

<ask>Каким большинством голосов принимается решение об изменении устава?

1. Простым большинством (более 50%)
2. 2/3 голосов присутствующих
3. 3/4 голосов присутствующих
4. Единогласно
   </ask>

<action>Сохранить в {{charter_amendment_majority}}</action>

<template-output>charter_amendment_majority</template-output>

</step>

<step n="29" goal="Порядок разрешения споров">

<ask>Как разрешаются споры между организацией и ее членами?

1. Путем переговоров
2. В третейском суде
3. В судебном порядке
4. Комбинированный порядок (сначала переговоры, затем суд)
5. Другой порядок (укажите)
   </ask>

<action>Сохранить описание в {{dispute_resolution_procedure}}</action>

<template-output>dispute_resolution_procedure</template-output>

</step>

<step n="30" goal="Учредители организации">

<ask>Укажите список учредителей организации:
Для каждого учредителя укажите:

- Полное наименование (для юридических лиц) или ФИО (для физических лиц)
- Юридический адрес / место жительства
- Для юридических лиц: ИНН, ОКПО

Формат:

1. [Наименование/ФИО], [Адрес], [ИНН/ОКПО если есть]
2. ...
   </ask>

<action>Сформировать оформленный список учредителей для {{founders_list}}</action>

<template-output>founders_list</template-output>

</step>

<step n="31" goal="Финализация и сохранение устава">

<action>Собрать все переменные и заполнить template.md</action>
<action>Сохранить устав в файл: {output_folder}/Устав-КФА-{date}.md</action>

<critical>Устав создан и сохранен!</critical>

<action>Показать пользователю сводку:

- Путь к файлу устава
- Основные параметры (название, адрес, количество учредителей)
- Следующие шаги (регистрация, нотариальное заверение)
  </action>

</step>

</workflow>
