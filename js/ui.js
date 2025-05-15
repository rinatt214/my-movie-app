// ===========================
// 🎨 页面渲染模块
// ===========================

//显示当前电影
function showCurrentMovie(){
    const movie = selectedMovies[currentIndex];
    document.getElementById("movie-container").innerHTML = generateMovieCard(movie, false); // false = 初始选择模式
    const container = document.getElementById("movie-container");
    container.innerHTML = `
      <div class = "movie-card">
        <img src = "${movie.poster}" alt="封面图" class="movie-poster">
        <div class = "movie-info">
          <h2 class="movie-title">${movie.name} <span class="movie-year">(${movie.year})</span></h2>
          <p class="movie-meta">⭐ ${movie.rating.toFixed(1)} | 🎬 ${movie.genre}</p>
          <p class="movie-desc collapsed" id="movie-desc">${movie.description}</p>
          <button class="toggle-desc-btn" onclick="toggleDescription()">▶ 显示更多</button>
          <div class="movie-buttons">
            <button onclick="handleChoice('Like')">👍 喜欢</button>
            <button onclick="handleChoice('DisLike')">👎 不喜欢</button>
            <button onclick="handleChoice('DontKnow')">❓ 没看过</button>
            <button onclick="toggleFavorite()">❤️ 收藏</button>
           </div>
        </div>
       </div>
    `;
}

// 显示推荐 / 初始电影的通用卡片
function generateMovieCard(movie, isRecommendation = false) {
  const buttons = isRecommendation
  ? `
    <button onclick="handleRecommendationChoice('${movie.name}', 'Like')">👍 喜欢</button>
    <button onclick="handleRecommendationChoice('${movie.name}', 'Dislike')">👎 不喜欢</button>
    <button onclick="handleRecommendationChoice('${movie.name}', 'DontKnow')">❓ 没看过</button>
  `
  : `
    <button onclick="handleChoice('Like')">👍 喜欢</button>
    <button onclick="handleChoice('Dislike')">👎 不喜欢</button>
    <button onclick="handleChoice('DontKnow')">❓ 没看过</button>
  `;

return `
  <div class="movie-card">
    <img src="${movie.poster}" class="movie-poster" alt="封面图">
    <div class="movie-info">
      <h2 class="movie-title">${movie.name} (${movie.year})</h2>
      <p class="movie-meta">⭐ ${round1(movie.rating)} | 🎬 ${movie.genre}</p>
      <p class="movie-desc collapsed" id="movie-desc">${movie.description}</p>
      <button class="toggle-desc-btn" onclick="toggleDescription()">▶ 显示更多</button>
      <div class="movie-buttons">${buttons}</div>
    </div>
  </div>
`;
  }

//推荐逻辑(根据用户喜欢的类型)
function showRecommendation() {
  console.log("开始推荐电影");
  const movie = getNextRecommendation(); // 获取一部推荐电影
  const container = document.getElementById("recommendation");

  if (!movie) {
    container.innerHTML = `<p>🎬 没有更多可推荐的电影了，试试多标记几个喜欢的吧！</p>`;
    return;
  }

  container.innerHTML = generateMovieCard(movie, true); // 展示推荐卡片  // true = 推荐模式
  }


function showFavorites(){
    const container = document.getElementById("favorite-list");

    if(favorites.lengh === 0){
            container.innerHTML = "<h3>你还没有收藏任何电影</h3>";
            return;
    }

    const html = favorites.map(movie => `<li>${movie.name} (${movie.year})｜${movie.genre}</li>`).join("");

    container.innerHTML = `
            <h3>你收藏的电影:</h3>
            <ul>${html}</ul>
            `;     
}

//绘图函数
function showCharts(){
    const ctx = document.getElementById("chartCanvas").getContext("2d");

    //统计喜欢的类型
    const likedTypes = {};
    for(let name in userChoices){
        if(userChoices[name] === "Like"){
            const movie = movies.find(m => m.name === name);
            if(movie && movie.genre && movie.genre !== "未知"){
                const tyoes = movie.genre.split(" / ");
                tyoes.forEach(type => {
                    likedTypes[type] = (likedTypes[type] || 0) + 1;
                });
            }
        }
    }

    //如果之前画过图，销毁它
    if(window.myChart){
        window.myChart.destroy();
    }

    window.myChart = new Chart(ctx, {
        type: "bar",
        data: {
            labels: Object.keys(likedTypes),
            datasets: [{
                label: "喜欢的类型数量",
                data: Object.values(likedTypes),
                backgroundColor: "rgba(75, 192, 192, 0.5)"
        }]
    },
    options:{
        responsive: false,
        scales: {
            y: {
                beginAtZero: true
            }
        }
    }
});
}

function toggleDescription(){
    const desc = document.getElementById("movie-desc");
    const btn = document.querySelector(".toggle-desc-btn");

    if(desc.classList.contains("collapsed")){
        desc.classList.remove("collapsed");
        btn.innerText = "▲ 收起";
    }else{
        desc.classList.add("collapsed");
        btn.innerText = "▶ 显示更多";
    }
}
