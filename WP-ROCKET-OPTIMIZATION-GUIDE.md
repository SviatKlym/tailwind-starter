# WP Rocket: Детальное руководство по оптимизации

## 🚀 Базовые настройки WP Rocket

### Cache Settings
```php
// Основные настройки кеширования
- Cache Lifespan: 10 hours (по умолчанию)
- Mobile Cache: ✅ Включено
- User Cache: ✅ Включено для пользователей
- Cache Query Strings: ❌ Отключено
```

### File Optimization
```php
// Минификация файлов
- Minify CSS: ✅ Включено
- Combine CSS: ✅ Включено  
- Exclude CSS: /wp-admin/*, /wp-content/plugins/*/admin/*
- Remove Unused CSS: ✅ Включено

- Minify JS: ✅ Включено
- Combine JS: ❌ Отключено (может сломать блоки)
- Load JS Deferred: ✅ Включено для несущественных скриптов
```

---

## 🎯 Специфичные настройки для темы

### Critical CSS Configuration
```css
/* Критический CSS для блоков */
.hero-section,
.feature-grid,
.visual-block {
    /* Основные стили блоков */
}

.wp-block-tailwind-starter-hero-block {
    display: block;
    position: relative;
}

.wp-block-tailwind-starter-feature-grid {
    display: grid;
    gap: 1.5rem;
}

/* Tailwind базовые утилиты */
.container, .mx-auto, .px-4, .py-8 {
    /* Критические утилиты */
}
```

### Исключения из оптимизации
```php
// CSS файлы для исключения из объединения
/wp-content/themes/tailwind-starter/src/visual-controls.css
/wp-content/themes/tailwind-starter/style.css

// JS файлы для исключения из минификации  
/wp-content/themes/tailwind-starter/src/utils/visual-controls.js
/wp-content/themes/tailwind-starter/src/utils/core-block-enhancements.js
jquery.min.js
```

---

## 📱 Mobile Optimization

### Mobile-Specific Settings
```php
// Мобильная оптимизация
- Separate Mobile Cache: ✅ Включено
- Mobile User Agent: Default WP Rocket detection
- Remove unused CSS on mobile: ✅ Включено
- Optimize images for mobile: ✅ Включено
```

### Responsive Images
```php
// Настройки адаптивных изображений
add_filter('wp_rocket_cache_mobile_files_tablet', '__return_true');

// Предзагрузка критических изображений для мобильных
add_action('wp_head', function() {
    if (wp_is_mobile()) {
        echo '<link rel="preload" as="image" href="/hero-mobile.webp">';
    }
});
```

---

## 🖼️ Media Optimization

### Image Settings
```php
// Настройки изображений
- WebP Compatibility: ✅ Включено
- Lazy Load Images: ✅ Включено
- Lazy Load Iframes: ✅ Включено
- Exclude from Lazy Load: .hero-image, .above-fold

// Replace YouTube iframe with preview image: ✅ Включено
```

### Image Dimensions и Preload
```php
// Предзагрузка критических изображений
add_action('wp_head', function() {
    // Hero изображения
    echo '<link rel="preload" as="image" href="/hero-bg.webp">';
    
    // Логотип в навигации
    echo '<link rel="preload" as="image" href="/logo.svg">';
    
    // Иконки для feature-grid
    echo '<link rel="preload" as="image" href="/icons/feature-1.svg">';
});

// Указание размеров изображений для предотвращения CLS
add_filter('wp_get_attachment_image_attributes', function($attr, $attachment, $size) {
    if (!isset($attr['width']) || !isset($attr['height'])) {
        $image_meta = wp_get_attachment_metadata($attachment->ID);
        if ($image_meta) {
            $attr['width'] = $image_meta['width'];
            $attr['height'] = $image_meta['height'];
        }
    }
    return $attr;
}, 10, 3);
```

---

## 🔗 Preloading Configuration

### DNS Prefetch
```html
<!-- DNS prefetch для внешних ресурсов -->
<link rel="dns-prefetch" href="//fonts.googleapis.com">
<link rel="dns-prefetch" href="//fonts.gstatic.com">
<link rel="dns-prefetch" href="//cdnjs.cloudflare.com">
```

### Resource Hints
```php
// Preconnect к критическим внешним ресурсам
add_action('wp_head', function() {
    echo '<link rel="preconnect" href="https://fonts.googleapis.com" crossorigin>';
    echo '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>';
}, 1);

// Preload критических ресурсов
add_action('wp_head', function() {
    // Основной CSS файл темы
    echo '<link rel="preload" href="' . get_stylesheet_uri() . '" as="style">';
    
    // Tailwind CSS
    $tailwind_css = get_template_directory_uri() . '/dist/tailwind.css';
    echo '<link rel="preload" href="' . $tailwind_css . '" as="style">';
    
    // Блочные стили
    $blocks_css = get_template_directory_uri() . '/dist/blocks.css';
    echo '<link rel="preload" href="' . $blocks_css . '" as="style">';
}, 2);
```

---

## ⚡ Database Optimization

### Query Optimization
```php
// Оптимизация запросов блоков
add_action('init', function() {
    // Кеширование мета-запросов блоков
    add_filter('posts_clauses', function($clauses, $query) {
        if ($query->is_main_query() && !is_admin()) {
            // Добавляем индексы для мета полей блоков
            global $wpdb;
            $wpdb->query("ALTER TABLE {$wpdb->postmeta} ADD INDEX idx_meta_key_value (meta_key, meta_value(255))");
        }
        return $clauses;
    }, 10, 2);
});

// Оптимизация autoload options
add_action('wp_loaded', function() {
    // Отключаем autoload для больших мета полей блоков
    $large_meta_keys = [
        '_block_visual_settings',
        '_block_custom_styles', 
        '_block_advanced_options'
    ];
    
    foreach ($large_meta_keys as $meta_key) {
        add_filter("add_option_{$meta_key}", function($value, $option) {
            // Принудительно отключаем autoload
            return add_option($option, $value, '', 'no');
        }, 10, 2);
    }
});
```

### Transients для блоков
```php
// Кеширование сложных вычислений блоков
function cache_block_styles($block_attributes) {
    $cache_key = 'block_styles_' . md5(serialize($block_attributes));
    
    $cached_styles = get_transient($cache_key);
    if ($cached_styles !== false) {
        return $cached_styles;
    }
    
    // Генерируем стили (тяжелая операция)
    $styles = generate_tailwind_classes($block_attributes);
    
    // Кешируем на 1 час
    set_transient($cache_key, $styles, HOUR_IN_SECONDS);
    
    return $styles;
}
```

---

## 🔧 Advanced Configurations

### Custom WP Rocket Hooks
```php
// Кастомные хуки для темы
add_action('wp_rocket_loaded', function() {
    
    // Исключаем admin-ajax.php из кеширования для динамических блоков
    add_filter('rocket_cache_reject_uri', function($uri) {
        $uri[] = '/wp-admin/admin-ajax.php';
        $uri[] = '/wp-json/';
        return $uri;
    });
    
    // Очистка кеша при изменении блоков
    add_action('save_post', function($post_id) {
        if (has_blocks(get_post($post_id)->post_content)) {
            rocket_clean_post($post_id);
        }
    });
    
    // Кеширование для авторизованных пользователей с разными ролями
    add_filter('rocket_cache_dynamic_cookies', function($cookies) {
        $cookies[] = 'wordpress_logged_in_*';
        return $cookies;
    });
});
```

### Critical CSS Generation
```php
// Автоматическая генерация критического CSS
add_action('wp_rocket_critical_css_generated', function($css_content, $url) {
    
    // Добавляем блочные стили в критический CSS
    $block_critical_css = "
        .wp-block-tailwind-starter-hero-block { display: block; }
        .wp-block-tailwind-starter-feature-grid { display: grid; }
        .wp-block-tailwind-starter-visual-block { display: block; }
        
        /* Tailwind utilities above the fold */
        .container, .mx-auto, .px-4, .py-8, .text-center, .font-bold { }
    ";
    
    return $css_content . $block_critical_css;
}, 10, 2);
```

---

## 📊 Performance Monitoring

### Custom Performance Tracking
```php
// Мониторинг производительности блоков
add_action('wp_footer', function() {
    if (WP_DEBUG && current_user_can('administrator')) {
        ?>
        <script>
        // Мониторинг Core Web Vitals
        function measureBlockPerformance() {
            // Largest Contentful Paint
            new PerformanceObserver((entryList) => {
                const entries = entryList.getEntries();
                const lastEntry = entries[entries.length - 1];
                console.log('LCP:', lastEntry.startTime);
            }).observe({entryTypes: ['largest-contentful-paint']});
            
            // Cumulative Layout Shift
            let clsValue = 0;
            new PerformanceObserver((entryList) => {
                for (const entry of entryList.getEntries()) {
                    if (!entry.hadRecentInput) {
                        clsValue += entry.value;
                    }
                }
                console.log('CLS:', clsValue);
            }).observe({entryTypes: ['layout-shift']});
        }
        
        // Запускаем мониторинг после загрузки DOM
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', measureBlockPerformance);
        } else {
            measureBlockPerformance();
        }
        </script>
        <?php
    }
});
```

### Performance Alerts
```php
// Уведомления о проблемах производительности
add_action('wp_rocket_after_clean_domain', function() {
    // Проверяем PageSpeed после очистки кеша
    $url = home_url();
    $pagespeed_url = "https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=" . urlencode($url);
    
    $response = wp_remote_get($pagespeed_url);
    if (!is_wp_error($response)) {
        $data = json_decode(wp_remote_retrieve_body($response), true);
        $score = $data['lighthouseResult']['categories']['performance']['score'] * 100;
        
        if ($score < 90) {
            // Отправляем уведомление админу
            wp_mail(
                get_option('admin_email'),
                'Performance Alert: PageSpeed Score ' . $score,
                'Current PageSpeed score is ' . $score . '. Consider optimization.'
            );
        }
    }
});
```

---

## 🛡️ Security Considerations

### Cache Security
```php
// Безопасность кеширования
add_filter('rocket_cache_mandatory_cookies', function($cookies) {
    // Не кешируем страницы с конфиденциальными данными
    $cookies[] = 'user_preferences';
    $cookies[] = 'cart_contents';
    return $cookies;
});

// Защита директории кеша
add_action('init', function() {
    // Добавляем .htaccess в папку кеша
    $cache_dir = WP_CONTENT_DIR . '/cache/wp-rocket/';
    $htaccess_content = "
    <Files ~ '^\.'>
        Order allow,deny
        Deny from all
    </Files>
    
    <FilesMatch '\.(php|phtml|php3|php4|php5|pl|py|jsp|asp|sh|cgi)$'>
        Order allow,deny
        Deny from all
    </FilesMatch>
    ";
    
    if (!file_exists($cache_dir . '.htaccess')) {
        file_put_contents($cache_dir . '.htaccess', $htaccess_content);
    }
});
```

---

## 🔄 Automated Optimization Tasks

### Scheduled Tasks
```php
// Автоматические задачи оптимизации
add_action('wp', function() {
    if (!wp_next_scheduled('optimize_theme_cache')) {
        wp_schedule_event(time(), 'daily', 'optimize_theme_cache');
    }
});

add_action('optimize_theme_cache', function() {
    // Очищаем старые transients блоков
    global $wpdb;
    $wpdb->query("
        DELETE FROM {$wpdb->options} 
        WHERE option_name LIKE '_transient_block_styles_%' 
        AND option_name LIKE '_transient_timeout_block_styles_%'
        AND option_value < UNIX_TIMESTAMP()
    ");
    
    // Оптимизируем таблицы
    $wpdb->query("OPTIMIZE TABLE {$wpdb->posts}, {$wpdb->postmeta}, {$wpdb->options}");
    
    // Предварительно разогреваем критические страницы
    $critical_pages = ['/', '/about/', '/contact/', '/pricing/'];
    foreach ($critical_pages as $page) {
        wp_remote_get(home_url($page));
    }
});
```

---

## 📋 Checklist для внедрения

### Начальная настройка
- [ ] Установить и активировать WP Rocket
- [ ] Настроить базовые параметры кеширования
- [ ] Включить минификацию CSS/JS
- [ ] Настроить lazy loading изображений
- [ ] Добавить критический CSS для блоков

### Продвинутая оптимизация  
- [ ] Настроить preloading ресурсов
- [ ] Оптимизировать database запросы
- [ ] Добавить performance monitoring
- [ ] Настроить automated tasks
- [ ] Протестировать на PageSpeed Insights

### Мониторинг и поддержка
- [ ] Настроить alerts для производительности
- [ ] Регулярно проверять Core Web Vitals
- [ ] Обновлять critical CSS при изменениях
- [ ] Мониторить cache hit ratio
- [ ] Оптимизировать по результатам аналитики

---

*Последнее обновление: Январь 2025* 