// JavaScript: Invoice calculation logic
function convertNumberToWords(amount) {
  const words = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine',
    'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen',
    'Seventeen', 'Eighteen', 'Nineteen'];
  const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

  function numToWords(n) {
    if (n < 20) return words[n];
    if (n < 100) return tens[Math.floor(n / 10)] + (n % 10 ? ' ' + words[n % 10] : '');
    if (n < 1000) return words[Math.floor(n / 100)] + ' Hundred' + (n % 100 ? ' and ' + numToWords(n % 100) : '');
    if (n < 100000) return numToWords(Math.floor(n / 1000)) + ' Thousand' + (n % 1000 ? ' ' + numToWords(n % 1000) : '');
    if (n < 10000000) return numToWords(Math.floor(n / 100000)) + ' Lakh' + (n % 100000 ? ' ' + numToWords(n % 100000) : '');
    return numToWords(Math.floor(n / 10000000)) + ' Crore' + (n % 10000000 ? ' ' + numToWords(n % 10000000) : '');
  }

  const intPart = Math.floor(amount);
  const decimalPart = Math.round((amount - intPart) * 100);
  let result = numToWords(intPart) + ' Rupees';
  if (decimalPart > 0) {
    result += ' and ' + numToWords(decimalPart) + ' Paise';
  }
  return result + ' only';
}

function calculateTotals() {
  const rows = document.querySelectorAll("#itemBody tr");
  let subtotal = 0;

  rows.forEach(row => {
    const qty = parseFloat(row.cells[4].querySelector("input").value) || 0;
    const rate = parseFloat(row.cells[5].querySelector("input").value) || 0;
    const total = qty * rate;
    row.querySelector(".total").innerText = total.toFixed(2);
    subtotal += total;
  });

  document.getElementById("subtotal").innerText = subtotal.toFixed(2);

  const discountPercent = parseFloat(document.getElementById("discount").value) || 0;
  const discountAmount = (subtotal * discountPercent) / 100;
  document.getElementById("discountAmount").innerText = discountAmount.toFixed(2);

  const gstPercent = parseFloat(document.getElementById("gst").value) || 0;
  const gstAmount = ((subtotal - discountAmount) * gstPercent) / 100;

  const grandTotal = subtotal - discountAmount + gstAmount;
  document.getElementById("grandTotal").innerText = grandTotal.toFixed(2);

  document.getElementById("advance").innerText = (grandTotal * 0.05).toFixed(2);
  document.getElementById("designing").innerText = (grandTotal * 0.40).toFixed(2);
  document.getElementById("making").innerText = (grandTotal * 0.40).toFixed(2);
  document.getElementById("handover").innerText = (grandTotal * 0.15).toFixed(2);

  // Optional: Show amount in words (if element exists)
  if (document.getElementById("amountWords")) {
    document.getElementById("amountWords").innerText = convertNumberToWords(grandTotal);
  }

  // Optional: QR Code for payment (if element exists)
  if (document.getElementById("qrImage")) {
    const qrURL = `https://api.qrserver.com/v1/create-qr-code/?data=upi://pay?pa=naims@hdfcbank&pn=NAIMS%20INTERIOR&am=${grandTotal.toFixed(2)}&cu=INR&tn=Interior%20Invoice`;
    document.getElementById("qrImage").src = qrURL;
  }
}