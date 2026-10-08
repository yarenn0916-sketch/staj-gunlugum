function beğen(buton) {
    let sayac=buton.querySelector('span');
    let mevcutSayi = parseInt(sayac.innerText);
    sayac.innerText = mevcutSayi + 1;
}