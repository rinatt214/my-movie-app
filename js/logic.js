// ===========================
// 🎮 用户交互逻辑模块
// ===========================

let selectedMovies = [];        //最终展示的10部电影
let currentIndex = 0;           //当前展示的第几部
let recommendedMovies = [];     //存放已推荐的电影名
let userChoices = JSON.parse(localStorage.getItem("userChoices") || "{}");           //用户选择结果{电影名：喜好}
let favorites = JSON.parse(localStorage.getItem("favorites") || "[]");

//处理按钮点击
function handleChoice(feedback){
    const movie = selectedMovies[currentIndex];
    userChoices[movie.name] = feedback;
    localStorage.setItem("userChoices", JSON.stringify(userChoices));
    currentIndex++;

    if(currentIndex < selectedMovies.length){
            showCurrentMovie();     //显示下一部
    }else{
            document.getElementById("movie-container").innerHTML = "<h2>初步选择完成！</h2>";
            document.getElementById("choice-buttons").style.display = "none";
            showRecommendation();   //显示推荐
    }
}

function toggleFavorite(){
    const movie = selectedMovies[currentIndex];
    const exists = favorites.find(f => f.name === movie.name);
if(exists){
    //取消收藏
    favorites = favorites.find(f => f.name !== movie.name);
}else{
    //添加收藏
    favorites.push(movie);
}

localStorage.setItem("favories", JSON.stringify(favorites));
showFavorites();        //更新显示
}

//清楚历史记录
function clearChoices(){
    localStorage.removeItem("userChoices");
    alert("已清除历史记录，请刷新页面重新开始！");
}

function recommendMore(){
    const likedGenres = [];

    for (let name in userChoices){
            if(userChoices[name] === "Like"){
                    const genre = movies.find(m => m.name === name)?.genre;
                    if(genre && !likedGenres.includes(genre)){
                            likedGenres.push(genre);
                    }
            }
    }

    const candidates = movies.filter(m => likedGenres.includes(m.genre) && !(m.name in userChoices) && !recommendedMovies.includes(m.name));

    if(candidates.length > 0){
            const rec = candidates[Math.floor(Math.random() * candidates.length)];
            recommendedMovies.push(rec.name);       //标记已推荐
            const recDiv = document.getElementById("recommendation");
            recDiv.innerHTML += `
            <div style = "margin-top: 10px; padding: 10px; border-top: 1px solid #ccc;">
              <p><strong>${rec.name}</strong>(${rec.year}) | 评分：${rec.rating.toFixed(1)}｜类型：${rec.genre}</p>
              <p>${rec.description}</p>
            </div>
          `;
    }else{
            alert("没有更多电影可以推荐了!");
    }
}