# Panduan Integrasi Modul 3D Indoor Farming ke Project `buncop_iot`

Panduan ini menjelaskan cara memasang dan mengintegrasikan prototype simulasi 3D **Indoor Farming & Tandon MPOIN** ke dalam web aplikasi [indoor_farming.blade.php](file:///C:/Users/KINDY/Documents/Magang%20Project/buncop_iot/incubator/resources/views/indoor_farming.blade.php) pada project `C:\Users\KINDY\Documents\Magang Project\buncop_iot\incubator` (`http://10.14.41.225:8003/indoor-farming`).

---

## 1. File Bundle Mandiri yang Dihasilkan (*Standalone Widget*)

Modul 3D telah dikompilasi ke dalam folder [public/dist-3d/](file:///c:/Users/KINDY/Documents/Experiment/public/dist-3d/):

| Nama File | Ukuran (Gzip) | Keterangan |
|---|---|---|
| `indoor-farming-3d.umd.js` | ~249 KB | Script mandiri (sudah ter-bundle React, Three.js, Lucide Icons). **Tidak perlu install npm React di buncop_iot!** |
| `indoor-farming-3d.css` | ~11 KB | Styling glassmorphism, pop up, docking kontrol & Tailwind |
| `indoor-farming-3d.es.js` | ~322 KB | Format ES Module jika ingin di-import via Vite |

---

## 2. Langkah Cepat Pemasangan ke `buncop_iot`

### Langkah A: Salin File Bundle
Salin isi folder `public/dist-3d/` dari project ini ke folder public project `buncop_iot`:

```
c:\Users\KINDY\Documents\Experiment\public\dist-3d\
   ├── indoor-farming-3d.umd.js
   └── indoor-farming-3d.css
```
👉 Salin ke:
```
C:\Users\KINDY\Documents\Magang Project\buncop_iot\incubator\public\vendor\indoor-farming-3d\
```

---

### Langkah B: Pasang Elemen 3D di `indoor_farming.blade.php`

Buka file [indoor_farming.blade.php](file:///C:/Users/KINDY/Documents/Magang%20Project/buncop_iot/incubator/resources/views/indoor_farming.blade.php), lalu tambahkan CSS di `<head>` dan container 3D di posisi yang diinginkan (misal di bawah hero atau di panel tersendiri):

#### 1. Di bagian `<head>`:
```html
<!-- Style 3D Digital Twin Simulation -->
<link rel="stylesheet" href="{{ asset('vendor/indoor-farming-3d/indoor-farming-3d.css') }}">
```

#### 2. Di bagian `<body>` (misal di dalam `.if-wrap`):
```html
<!-- PANEL 3D DIGITAL TWIN INDOOR FARMING -->
<div class="if-panel" style="padding: 0; overflow: hidden; margin-bottom: 24px; border: 1px solid #0284c7; box-shadow: 0 20px 40px rgba(2, 132, 199, 0.12);">
    <div class="p-4 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
        <div class="flex items-center gap-2">
            <span class="inline-block w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
            <h3 class="text-sm font-bold text-white tracking-wide uppercase">3D Digital Twin • Monitoring & Otomatisasi Fisik</h3>
        </div>
        <span class="text-xs text-sky-400 font-medium">Interaktif: Orbit • Zoom • Kendali Aktuator</span>
    </div>

    <!-- Container Utama 3D -->
    <div id="indoor-farming-3d-root" style="width: 100%; height: 680px; position: relative; background: #0A0E18;"></div>
</div>
```

#### 3. Di bagian bawah sebelum penutup `</body>`:
```html
<!-- Script 3D Simulation Widget -->
<script src="{{ asset('vendor/indoor-farming-3d/indoor-farming-3d.umd.js') }}"></script>
```

> **Catatan:** Script secara otomatis mengenali elemen dengan `id="indoor-farming-3d-root"` dan langsung me-mount visualisasi 3D tanpa kode tambahan!

---

## 3. Integrasi Interaktif Dua Arah dengan MQTT `buncop-mqtt.js`

Jika ingin menghubungkan simulasi 3D agar merespons data sensor dan relay MQTT real-time, Anda dapat mengontrolnya via JavaScript:

```html
<script>
document.addEventListener('DOMContentLoaded', function() {
    // Inisialisasi controller 3D
    const sim3D = window.IndoorFarming3D.mount('#indoor-farming-3d-root', {
        // Callback saat user mengklik pompa atau valve di tampilan 3D
        onActuatorChange: function(actuatorName, newState) {
            console.log('User mengklik aktuator 3D:', actuatorName, newState);
            
            // Contoh kirim command ke MQTT buncop_iot:
            if (typeof publishMqttMessage === 'function') {
                publishMqttMessage(`indoor_farming/control/${actuatorName}`, newState ? 'ON' : 'OFF');
            }
        }
    });

    // Contoh saat pesan MQTT masuk dari sensor / relay:
    // Ketika buncop-mqtt.js menerima payload:
    /*
    onMqttMessageArrived(function(topic, payload) {
        if (topic === 'indoor_farming/telemetry') {
            const data = JSON.parse(payload);
            
            // Perbarui level tandon atau status pompa
            if (sim3D && sim3D.updateTelemetry) {
                sim3D.updateTelemetry({
                    tank1Level: data.water_level_pct,
                    pump1Status: data.relay_pump1 === 1
                });
            }
        }
    });
    */
});
</script>
```

---

## 4. Cara Melakukan Build Ulang Jika Ada Perubahan 3D di Masa Mendatang

Jika Anda melakukan kustomisasi atau penambahan objek pada prototype di project ini, cukup jalankan satu perintah:

```bash
npm run build:widget
```

Perintah di atas akan langsung memperbarui file di `public/dist-3d/` dalam hitungan detik.
