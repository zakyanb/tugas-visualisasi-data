// Menunggu sampai seluruh halaman HTML selesai dimuat
document.addEventListener("DOMContentLoaded", () => {
    // Memuat data CSV LOKAL kita
    // Ini akan BERHASIL di GitHub karena heart.csv berukuran kecil!
    Papa.parse("heart.csv", {
        download: true,
        header: true,
        dynamicTyping: true, // Otomatis ubah angka dari teks jadi angka
        skipEmptyLines: true,
        complete: (results) => {
            console.log("Data heart.csv berhasil dimuat:", results.data);
            
            // Panggil fungsi untuk menggambar setiap grafik
            createBarChart(results.data);
            createAgeHistogram(results.data);
            createScatterPlot(results.data);
        }
    });
});

/**
 * 1. VISUALISASI GRAFIK BATANG (BAR CHART)
 * Menampilkan jumlah pasien berdasarkan target (sakit vs. tidak)
 */
function createBarChart(data) {
    // Langkah 1: Proses Data
    let countTarget0 = 0;
    let countTarget1 = 0;

    data.forEach(row => {
        if (row.target === 0) {
            countTarget0++;
        } else if (row.target === 1) {
            countTarget1++;
        }
    });
    
    const labels = ["Tidak Sakit Jantung (0)", "Sakit Jantung (1)"];
    const values = [countTarget0, countTarget1];

    // Langkah 2: Gambar Grafiknya
    const ctx = document.getElementById('chart1').getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Jumlah Pasien',
                data: values,
                backgroundColor: ['rgba(54, 162, 235, 0.6)', 'rgba(255, 99, 132, 0.6)'],
                borderColor: ['rgba(54, 162, 235, 1)', 'rgba(255, 99, 132, 1)'],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: { beginAtZero: true }
            }
        }
    });
}

/**
 * 2. VISUALISASI HISTOGRAM UMUR (sebagai Bar Chart)
 * Menampilkan jumlah pasien per kelompok umur
 */
function createAgeHistogram(data) {
    // Langkah 1: Buat "Bins" (Kelompok Umur)
    const bins = {
        "20-29": 0, "30-39": 0, "40-49": 0, "50-59": 0, "60-69": 0, "70-79": 0
    };

    // Masukkan data ke dalam bins
    data.forEach(row => {
        const age = row.age;
        if (age < 30) bins["20-29"]++;
        else if (age < 40) bins["30-39"]++;
        else if (age < 50) bins["40-49"]++;
        else if (age < 60) bins["50-59"]++;
        else if (age < 70) bins["60-69"]++;
        else if (age < 80) bins["70-79"]++;
    });

    const labels = Object.keys(bins);
    const values = Object.values(bins);

    // Langkah 2: Gambar Grafiknya
    const ctx = document.getElementById('chart2').getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Jumlah Pasien',
                data: values,
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: { beginAtZero: true }
            }
        }
    });
}

/**
 * 3. VISUALISASI SCATTER PLOT
 * Hubungan Kolesterol (y) vs. Tekanan Darah (x), diwarnai oleh 'target'
 */
function createScatterPlot(data) {
    // Langkah 1: Pisahkan data berdasarkan target
    const dataTarget0 = []; // Tidak sakit jantung
    const dataTarget1 = []; // Sakit jantung

    data.forEach(row => {
        const point = { x: row.trestbps, y: row.chol };
        if (row.target === 0) {
            dataTarget0.push(point);
        } else {
            dataTarget1.push(point);
        }
    });

    // Langkah 2: Gambar Grafiknya
    const ctx = document.getElementById('chart3').getContext('2d');
    new Chart(ctx, {
        type: 'scatter', // Tipe grafik
        data: {
            datasets: [
                {
                    label: 'Tidak Sakit Jantung (0)',
                    data: dataTarget0,
                    backgroundColor: 'rgba(54, 162, 235, 0.6)'
                },
                {
                    label: 'Sakit Jantung (1)',
                    data: dataTarget1,
                    backgroundColor: 'rgba(255, 99, 132, 0.6)'
                }
            ]
        },
        options: {
            responsive: true,
            scales: {
                x: {
                    beginAtZero: false,
                    title: { display: true, text: 'Tekanan Darah (trestbps)' }
                },
                y: {
                    beginAtZero: false,
                    title: { display: true, text: 'Kolesterol (chol)' }
                }
            }
        }
    });
}