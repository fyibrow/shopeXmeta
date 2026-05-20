<?php
$id = $_GET['id'] ?? '';

// Default Fallback jika data kosong
$destination = 'https://shopee.co.id';
$title       = 'Lihat Video Selengkapnya';
$description = 'Facebook.com';
$image       = '';

// Ambil data dari JSON
if (!empty($id) && file_exists('database.json')) {
    $dbData = json_decode(file_get_contents('database.json'), true);
    if (isset($dbData[$id])) {
        $destination = $dbData[$id]['dest'];
        $title       = $dbData[$id]['title'];
        $description = $dbData[$id]['desc'];
        $image       = $dbData[$id]['img'];
    }
}

$userAgent = $_SERVER['HTTP_USER_AGENT'] ?? '';

// DETEKSI KLIK ASLI MANUSIA: 
// Manusia yang mengeklik link di dalam aplikasi FB (Android/iOS) PASTI memiliki kata kunci 'FBAN' atau 'FBAV' di browser internal mereka.
$isRealHumanClick = (strpos($userAgent, 'FBAN') !== false || strpos($userAgent, 'FBAV') !== false || strpos($userAgent, 'FB_IAB') !== false);

if ($isRealHumanClick) {
    // --- JIKA MANUSIA ASLI (Klik dari dalam aplikasi FB): LANGSUNG LEMPAR KE SHOPEE ---
    ?>
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <meta name="referrer" content="no-referrer">
        <meta http-equiv="refresh" content="0;url=<?php echo $destination; ?>">
        <script type="text/javascript">
            window.location.replace("<?php echo $destination; ?>");
        </script>
    </head>
    <body>
        <p>Menuju halaman produk...</p>
    </body>
    </html>
    <?php
    exit;
} else {
    // --- JIKA BOT FACEBOOK (Atau saat baru ditempel di status): PAKSA TAMPILKAN PREVIEW PALSU ---
    ?>
    <!DOCTYPE html>
    <html lang="id">
    <head>
        <meta charset="UTF-8">
        <title><?php echo htmlspecialchars($title); ?></title>
        
        <meta property="og:type" content="website" />
        <meta property="og:title" content="<?php echo htmlspecialchars($title); ?>" />
        <meta property="og:description" content="<?php echo htmlspecialchars($description); ?>" />
        <meta property="og:image" content="<?php echo htmlspecialchars($image); ?>" />
        <meta property="og:image:secure_url" content="<?php echo htmlspecialchars($image); ?>" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:type" content="image/jpeg" />
        
        <script type="text/javascript">
            setTimeout(function(){
                window.location.replace("<?php echo $destination; ?>");
            }, 1500);
        </script>
    </head>
    <body style="background:#f0f2f5; font-family:sans-serif; display:flex; justify-content:center; align-items:center; height:100vh; margin:0;">
        <div style="text-align:center;">
            <p>Memuat Konten...</p>
        </div>
    </body>
    </html>
    <?php
    exit;
}
