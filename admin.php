<?php
session_start();
$admin_user = "admin"; // Ganti username Anda
$admin_pass = "admin123"; // Ganti password Anda yang kuat

// Logika Login
if (isset($_POST['login'])) {
    if ($_POST['user'] == $admin_user && $_POST['pass'] == $admin_pass) {
        $_SESSION['logged_in'] = true;
    } else { $error = "Username atau Password salah!"; }
}

// Logika Logout
if (isset($_GET['logout'])) { session_destroy(); header("Location: admin.php"); exit; }

// Logika Hapus
if (isset($_GET['delete'])) {
    $file = 'uploads/' . $_GET['delete'];
    if (file_exists($file)) unlink($file);
    header("Location: admin.php"); exit;
}

// Cek Sesi Login
if (!isset($_SESSION['logged_in'])) {
?>
<!DOCTYPE html>
<html lang="id"><head><script src="https://cdn.tailwindcss.com"></script></head>
<body class="bg-slate-50 flex items-center justify-center min-h-screen">
    <form method="POST" class="bg-white p-8 rounded-3xl shadow-xl w-full max-w-sm border">
        <h2 class="text-2xl font-bold mb-6">Admin Login</h2>
        <?php if(isset($error)) echo "<p class='text-red-500 text-sm mb-4'>$error</p>"; ?>
        <input name="user" placeholder="Username" class="w-full mb-4 p-3 bg-slate-50 border rounded-xl outline-none">
        <input type="password" name="pass" placeholder="Password" class="w-full mb-6 p-3 bg-slate-50 border rounded-xl outline-none">
        <button name="login" class="w-full bg-slate-900 text-white p-3.5 rounded-xl font-bold hover:bg-slate-800 transition">Masuk</button>
    </form>
</body></html>
<?php exit; } 

// Data Dashboard
$dbData = file_exists('database.json') ? json_decode(file_get_contents('database.json'), true) : [];
$files = glob("uploads/*.{jpg,jpeg,png,webp}", GLOB_BRACE);
?>
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <title>Dashboard Admin</title>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-slate-50 p-4 md:p-8">
    <div class="max-w-6xl mx-auto">
        <div class="flex justify-between items-center mb-8">
            <h1 class="text-2xl font-bold">Dashboard Admin</h1>
            <a href="?logout=1" class="text-sm bg-red-50 text-red-600 px-4 py-2 rounded-lg font-bold">Logout</a>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div class="p-6 bg-white rounded-2xl shadow border"><p class="text-xs font-bold text-slate-400 uppercase">Total Generate</p><span class="text-3xl font-bold"><?php echo count($dbData); ?></span></div>
            <div class="p-6 bg-white rounded-2xl shadow border"><p class="text-xs font-bold text-slate-400 uppercase">Total Foto</p><span class="text-3xl font-bold"><?php echo count($files); ?></span></div>
        </div>

        <div class="bg-white rounded-2xl shadow p-6 border">
            <h2 class="text-lg font-bold mb-6">Manajemen Media & Link</h2>
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <?php foreach($files as $file): 
                    $filename = basename($file);
                    $linkUrl = "#"; $displayId = "Link tidak tersedia";
                    foreach($dbData as $id => $data) {
                        if (strpos($data['img'], $filename) !== false) {
                            $baseUrl = (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? "https" : "http") . "://$_SERVER[HTTP_HOST]";
                            $linkUrl = $baseUrl . "/redirect.php?id=" . $id;
                            $displayId = "ID: " . $id;
                            break;
                        }
                    }
                ?>
                <div class="border rounded-2xl p-3 bg-slate-50 shadow-sm hover:shadow-md transition">
                    <img src="<?php echo $file; ?>" class="w-full h-40 object-cover rounded-xl mb-3">
                    <p class="text-xs font-bold text-slate-700 truncate mb-1"><?php echo $displayId; ?></p>
                    <div class="flex flex-col gap-2">
                        <?php if($linkUrl !== "#"): ?>
                            <button onclick="copyToClipboard('<?php echo $linkUrl; ?>')" class="w-full text-[10px] bg-blue-600 text-white py-2 rounded-lg font-bold hover:bg-blue-700 transition">Copy Link</button>
                        <?php endif; ?>
                        <a href="?delete=<?php echo $filename; ?>" class="block text-center text-[10px] bg-red-600 text-white py-2 rounded-lg font-bold hover:bg-red-700 transition">Hapus Foto</a>
                    </div>
                </div>
                <?php endforeach; ?>
            </div>
        </div>
    </div>

    <script>
        function copyToClipboard(text) {
            navigator.clipboard.writeText(text).then(() => {
                alert("Link berhasil disalin!");
            });
        }
    </script>
</body>
</html>
