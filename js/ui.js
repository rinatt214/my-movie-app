// ===========================
// 🎨 页面渲染模块
// ===========================

//显示当前电影
function showCurrentMovie(){
    const movie = selectedMovies[currentIndex];
    const container = document.getElementById("movie-container");
    container.innerHTML = `
      <div class = "movie-card">
        <img src = "${movie.poster}" alt="封面图" class="movie-poster">
        <div class = "movie-info">
          <h2 class="movie-title">${movie.name} <span class="movie-year">(${movie.year})</span></h2>
          <p class="movie-meta">⭐ ${movie.rating.toFixed(1)} | 🎬 ${movie.genre}</p>
          <p class="movie-desc">${movie.description}</p>
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

//推荐逻辑(根据用户喜欢的类型)
function showRecommendation(){
    const likedGenres = [];

    for (let name in userChoices){
            if(userChoices[name] === "Like"){
                    const genre = movies.find(m => m.name === name)?.genre;
                    if(genre && !likedGenres.includes(genre)){
                            likedGenres.push(...genre.split(" / "));
                    }
            }
    }

    if (likedGenres.length === 0){
            document.getElementById("recommendation").innerText = "你还没有标记喜欢的电影，无法推荐";
            return;
    }

    const candidates = movies.filter(m => likedGenres.some(type => m.genre.includes(type)) && !(m.name in userChoices));
    if(candidates.length > 0){
            //按评分从高到低排序
            candidates.sort((a, b) => b.rating - a.rating);

            //用前3个评分最高的随机推荐一部
            const topRated = candidates.slice(0,3);
            const rec = topRated[Math.floor(Math.random() * topRated.length)];

            document.getElementById("recommendation").innerHTML = `
                    <img src="${rec.poster}" alt="封面图" style="max-width: 200px; border-radius: 10px; margin-bottom: 10px;">
                    <h3>推荐你看看:</h3>
                    <p><strong>${rec.name}</strong> (${rec.year}) | 评分: ${rec.rating.toFixed(1)} / 10| 类型: ${rec.genre}</p>
                    <p>${rec.description}</p>
                  `;
    }else{
            document.getElementById("recommendation").innerText = "没有更多可推荐的电影了，试试多选几个喜欢的！";    
    }
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

