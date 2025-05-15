//获取当前用户喜欢的类型
function getLikedgenres(){
    const likedGenres = [];
    for (let name in userChoices){
        if(userChoices[name] === "Like"){
            const genre = movies.find(m => m.name === name)?.genre;
            if(genre && !likedGenres.includes(genre)){
                likedGenres.push(genre);
            }
        }
    }
    return likedGenres;
}

//获取若干随机项
function getRandomItems(arr, count){
    const shuffled = arr.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
}

//获取下一个推荐
function getNextRecommendation(){
  const likedGenres = getLikedgenres();

  const likedBased = movies.filter(m => likedGenres.includes(m.genre) && !(m.name in userChoices));
  const exploreBased = movies.filter(m => !likedGenres.includes(m.genre) && !(m.name in userChoices));

  const pool = [
    ...getRandomItems(likedBased, 2),
    ...getRandomItems(exploreBased, 1)
  ];

  return pool.length ? getRandomItems(pool, 1)[0] : null;
}

