// ===========================
// 🛠️ 工具函数
// ===========================

function round1(x) {
    return typeof x === "number" ? x.toFixed(1) : x;
  }
  
  function splitGenres(str) {
    return str.split(" / ");
  }