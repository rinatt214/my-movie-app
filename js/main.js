// ===========================
// 🚀 页面入口模块
// ===========================

window.onload = async() => {
    await fetchGenreMap();          //拉类型表
    await fetchMoviesFromTMDB();    //获取电影数据

    if(Object.keys(userChoices).length >= 10){
            document.getElementById("movie-container").innerHTML = "<h2>欢迎回来！</h2>";
            document.getElementById("choice-buttons").style.display = "none";
            showRecommendation();
    }else{
            selectedMovies = getRandomMovies();
            showCurrentMovie();  
    }
    showFavorites();
};