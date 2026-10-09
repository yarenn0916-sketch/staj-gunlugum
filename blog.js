// Firebase Konfigürasyonu
const firebaseConfig = {
    databaseURL: "https://staj-gunlugum-default-rtdb.firebaseio.com"
};

// Firebase Başlat
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}
const database = firebase.database();

// Modül Listesi
const moduller = ['arastirma', 'veri_etiketleme', 'web_tasarim', 'yazici'];

// Sayfa açıldığında canlı verileri dinle ve buton durumlarını güncelle
moduller.forEach(modul => {
    // Canlı Firebase Dinleyicisi
    database.ref('begeniler/' + modul).on('value', (snapshot) => {
        const count = snapshot.val() || 0;
        const countElem = document.getElementById('like-count-' + modul);
        if (countElem) {
            countElem.innerText = count;
        }
    });

    // Kullanıcının daha önce beğenip beğenmediğini kontrol et (Buton stili için)
    if (localStorage.getItem('begendi_' + modul)) {
        const btn = document.getElementById('btn-' + modul);
        if (btn) btn.classList.add('liked');
    }
});

// Beğenme / Beğeniyi Geri Alma Fonksiyonu (Toggle)
function begen(modulAdi) {
    const modulRef = database.ref('begeniler/' + modulAdi);
    const begendiMi = localStorage.getItem('begendi_' + modulAdi);
    const btn = document.getElementById('btn-' + modulAdi);

    if (begendiMi) {
        // Zaten beğenilmişse: Beğeniyi geri al (-1)
        modulRef.transaction((mevcut) => {
            return Math.max((mevcut || 0) - 1, 0);
        }).then(() => {
            localStorage.removeItem('begendi_' + modulAdi);
            if (btn) btn.classList.remove('liked');
        });
    } else {
        // Beğenilmemişse: Beğeni ekle (+1)
        modulRef.transaction((mevcut) => {
            return (mevcut || 0) + 1;
        }).then(() => {
            localStorage.setItem('begendi_' + modulAdi, 'true');
            if (btn) btn.classList.add('liked');
        });
    }
}
