const API_KEY = `b1d0ae53b17e43d681894e2138b9655e`;
let newsList = [];
const menus = document.querySelectorAll(".menus button");
//console.log("mmm", menus); 7개 출력
menus.forEach(menu=>
    menu.addEventListener("click",(event)=>getNewsByCategory(event))
);
let url = new URL(
    //`https://newsapi.org/v2/top-headlines?country=us&apiKey=${API_KEY}` 
    `https://noona-times-be-5ca9402f90d9.herokuapp.com/top-headlines?country=kr`
);
let totalResult = 0;
let page = 1;
const pageSize = 10;
const groupSize = 5;

const getNews = async () => {  //겹치는 내용 함수로 만들기
    try{
        url.searchParams.set("page",page);  // => &page=page
        url.searchParams.set("pageSize",pageSize);
        //인터넷에 있는 데이터를 가져올 때 사용하는 함수는 여러 상황에서 에러가 발생할 수 있으므로 try catch 처리함 > 에러 핸들링
        //console.log("Fetching data from:", url); // 이 줄을 추가하여 URL을 로그로 확인
        const response = await fetch(url);
        //console.log("rrr", response)
        const data = await response.json();
        console.log("ddd", data); //> error발생시, console 출력해 확인
        if (response.status === 200) {
            if(data.articles.length === 0) {
                throw new Error("No result for this search")
            }
            newsList = data.articles;
            totalResult = data.totalResults;
            render();
            paginationRender();
        } else {
            throw new error(data.message)
        }
        
    } catch(error) {
        //console.log("error : ", error.message)
        errorRender(error.message);
    }
    
};

const getLatestNews = async () => {
    //const url = `https://newsapi.org/v2/top-headlines?country=us&apiKey=${API_KEY}`
    //자바스크립트는 개발자가 필요로하는 많은 함수들을 제공해줌 > 아래처럼 작성할 수 있음
    //const url = new URL(`https://newsapi.org/v2/top-headlines?country=us&apiKey=${API_KEY}`);
    url = new URL(
            //`https://newsapi.org/v2/top-headlines?country=kr&apiKey=${API_KEY}`
            `https://noona-times-be-5ca9402f90d9.herokuapp.com/top-headlines?country=kr`
        );
    //URL 호출 > 인터넷 세계에서 우리의 데이터를 긁어오는 것이 우리의 목표 > fetch 함수
    // const response = await fetch(url);
    // const data = await response.json();    //json : 파일형태의 확장자
    // newsList = data.articles;
    //render();
    //console.log("dddddd", newsList);  //pending(보류중)   //getNews함수를 만들어 겹치는 내용을 삭제해 간결하게 만듦 > 확인하려고 주석처리함
    getNews();
};

const getNewsByCategory = ( async(event) => {
    const category = event.target.textContent.toLowerCase();
    //console.log("category", category);
    //const url = new URL(`https://newsapi.org/v2/top-headlines?country=us&category=${category}&apiKey=${API_KEY}`)
    // const response = await fetch(url);
    // const data = await response.json();
    //console.log("Ddd", data);
    // newsList = data.articles;
    // render();
    url = new URL(
        //`https://newsapi.org/v2/top-headlines?country=kr&category=${category}&apiKey=${API_KEY}`
        `https://noona-times-be-5ca9402f90d9.herokuapp.com/top-headlines?country=kr&category=${category}`
        );
    getNews();
})

const getNewsByKeyword=( async() => {
    const keyword = document.getElementById("search-input").value;
    //console.log("keyword", keyword)
    //const url = new URL(`https://newsapi.org/v2/top-headlines?country=us&q=${keyword}&apiKey=${API_KEY}`);
    // const response = await fetch(url);
    // const data = await response.json();
    // newsList = data.articles;
    // render();
    url = new URL(
        //`https://newsapi.org/v2/top-headlines?country=kr&q=${keyword}&apiKey=${API_KEY}`
        `https://noona-times-be-5ca9402f90d9.herokuapp.com/top-headlines?country=kr&q=${keyword}`
        );
    getNews();
})  

const render=()=>{  //const는 재할당이 안됨!, 변수는 최대한 const를 사용하는 것이 좋음!
    const newsHTML = newsList.map(
        (news) => `<div class="row news"> <!-- 이미지, 글-->
                <div class="col-lg-4"> <!-- 이미지 -->
                    <img class="news-img-size" src=${news.urlToImage} />
                </div>
                <div class="col-lg-8"> <!-- 글 -->
                    <h2> <!-- 제목 -->
                        ${news.title}
                    </h2>
                    <p> <!-- 본문 -->
                        ${news.description}
                    </p>
                    <div> <!-- 설명글-->
                        ${news.source.name} * ${news.publishedAt}
                    </div>
                </div>
            </div>`
        ).join(''); //배열을 string타입으로 바꿔야겠다! > array to string javascript search

    console.log("html",newsHTML);
    document.getElementById('news-board').innerHTML=newsHTML
}

const errorRender = (errorMessage) => {
    const errorHTML = `<div class="alert alert-danger" role="alert">
    ${errorMessage}
    </div>`;
    
    document.getElementById("news-board").innerHTML=errorHTML;
};

const paginationRender = () => {
    //totalResult
    //page
    //pageSize
    //totalPages
    const totalPages = Math.ceil(totalResult/pageSize);
    //groupSize

    //pageGroup
    const pageGroup = Math.ceil(page / groupSize);
    //lastPage
    let lastPage = pageGroup * groupSize;
    //마지막 페이지 그룹이 그룹 사이즈보다 작다? lastPage = totalPage
    if (lastPage > totalPages) {
        lastPage = totalPages;
    }
    //firstPage
    const firstPage = lastPage - (groupSize - 1) <= 0 ? 1 : lastPage - (groupSize - 1);
    //first ~ last
    
    let paginationHTML = `<li class="page-item" onclick="moveToPage(${page-1})"><a class="page-link" href="#">Previous</a></li>`;

    for(let i=firstPage; i<=lastPage; i++) {
        paginationHTML += `<li class="page-item ${i === page ? "active" : ""}" onclick="moveToPage(${i})"><a class="page-link">${i}</a></li>`
    }
    paginationHTML += `<li class="page-item" onclick="moveToPage(${page+1})"><a class="page-link" href="#">Next</a></li>`
    document.querySelector(".pagination").innerHTML = paginationHTML;

    // <nav aria-label="Page navigation example">
    // <ul class="pagination">
    //     <li class="page-item"><a class="page-link" href="#">Previous</a></li>
    //     <li class="page-item"><a class="page-link" href="#">1</a></li>
    //     <li class="page-item"><a class="page-link" href="#">2</a></li>
    //     <li class="page-item"><a class="page-link" href="#">3</a></li>
    //     <li class="page-item"><a class="page-link" href="#">Next</a></li>
    // </ul>
    // </nav>
}

const moveToPage=(pageNum)=>{
    console.log("movetopage", pageNum);
    page = pageNum;
    getNews();
};
getLatestNews();

//1. 버튼들에 클릭 이벤트 주기
//2. 카테고리별 뉴스 가져오기
//3. 그 뉴스를 보여주기
