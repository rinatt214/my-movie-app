// ===========================
// 🔌 数据请求模块
// ===========================

let genreMap = {};
let movies = [];

async function fetchGenreMap(){
    const apiKey = "c0561d7828841c2b8dfa1741c3cc345d";
    const url = `https://api.themoviedb.org/3/genre/movie/list?api_key=${apiKey}&language=zh-CN`;

    try{
            const res = await fetch(url);
            const data = await res.json();
            data.genres.forEach(genre => {
                    genreMap[genre.id] = genre.name;
            });
    }catch(err){
            console.error("获取类型失败", err);
    }
}

//加载TMDB数据
async function fetchMoviesFromTMDB(){
    const apiKey = "c0561d7828841c2b8dfa1741c3cc345d";
    const genresLoaded = Object.keys(genreMap).length > 0;
    if(!genresLoaded) await fetchGenreMap();

    for(let page = 1; page <= 3; page++){
        const url = `https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&language=zh-CN&page=${page}`;

        const res = await fetch(url);
        const data = await res.json();

            //转换数据机构为系统所需要的格式
        const pageMovies = data.results.map(movie => ({
                    name: movie.title || "未命名",
                    rating: movie.vote_average || "无评分",
                    genre: movie.genre_ids?.map(id => genreMap[id]).join(" / ") || "未知",
                    description: movie.overview || "暂无简介",
                    country: "未知",
                    language: "未知",
                    year: movie.release_data?.split("-")[0] || "未知",
                    poster: movie.poster_path?`https://image.tmdb.org/t/p/w500${movie.poster_path}`: null
            }));
            movies = movies.concat(pageMovies);
    }
    //启动推荐流程
    selectedMovies = getRandomMovies();
    showCurrentMovie();
}

//打乱电影列表并取前10部
function getRandomMovies(){
    const shuffled = [...movies].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 10);
}