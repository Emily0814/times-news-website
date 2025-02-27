const API_KEY = `b1d0ae53b17e43d681894e2138b9655e`;
let newsList = [];
const menus = document.querySelectorAll(".menus button"); // 메뉴 버튼 요소 선택
//console.log("mmm", menus); 7개 출력
let url = new URL(
    //`https://newsapi.org/v2/top-headlines?country=us&apiKey=${API_KEY}` 
    `https://noona-times-be-5ca9402f90d9.herokuapp.com/top-headlines?country=kr`
);
let totalResult = 0;
let page = 1;
const pageSize = 10;
const groupSize = 5;
const noImageUrl = 'images/no-image.png'; // 다운로드한 'no image' 이미지의 경로

//getNews 함수에서 data.articles 존재 여부 확인
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
            if (!data.articles || data.articles.length === 0) {
                throw new Error("No result for this search");
            }
            newsList = data.articles;
            totalResult = data.totalResults;
            render();
            paginationRender();
        } else {
            throw new Error(data.message)
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
    page = 1;   //페이지 초기화
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
    page = 1;   //페이지 초기화
    getNews();
})

//검색어로 뉴스 가져오기
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
    page = 1; // 페이지 번호 초기화 > getNewsByKeyword 함수에서 새로운 검색을 수행할 때마다 페이지 번호(page)를 초기화하지 않으면, 이전 상태의 페이지 번호가 유지되어 데이터 접근에 문제가 생길 수 있음
    await getNews();
    //입력창 리셋 및 포커스
    document.getElementById("search-input").value = ""; //keyword 변수를 재할당하지 말고, 입력 필드의 값을 직접 초기화
    document.getElementById("search-input").focus();
})  

//모바일용 검색 함수
const getNewsByMobileKeyword = async () => {
    const keyword = document.getElementById("mobile-search-input").value;
    url = new URL(`https://noona-times-be-5ca9402f90d9.herokuapp.com/top-headlines?country=kr&q=${keyword}`);
    page = 1; // 페이지 번호 초기화
    await getNews();
    // 입력창 리셋 및 포커스
    document.getElementById("mobile-search-input").value = "";
    document.getElementById("mobile-search-input").focus();
    // 사이드 메뉴 닫기
    document.querySelector('.side-menu').classList.remove('active');
};

const render=()=>{  //const는 재할당이 안됨!, 변수는 최대한 const를 사용하는 것이 좋음!


    const newsHTML = newsList.map( (news) => {
            //이미지 처리
            const imageSrc = news.urlToImage && news.urlToImage !== '' ? news.urlToImage : noImageUrl;
            //출처 처리
            const sourceName = news.source && news.source.name ? news.source.name : 'no source';
            // 날짜 처리 - 상대 시간으로 변환
            const publishedDate = news.publishedAt ? timeSince(news.publishedAt) : 'no date';
            return `<div class="row news"> <!-- 이미지, 글-->
                <div class="col-lg-4"> <!-- 이미지 -->
                    <img
                        class="news-img-size"
                        src="${imageSrc}"
                        alt="News Image"
                        onerror="this.onerror=null;this.src='${noImageUrl}';"
                    />
                </div>
                <div class="col-lg-8"> <!-- 글 -->
                    <h2> <!-- 제목 -->
                        ${news.title}
                    </h2>
                    <p> <!-- 본문 -->
                        <!-- $^{news.description} $만 있으면 주석처리 안되서 ^추가 -->
                        ${truncateText(news.description, 200)} <!-- description 길이를 100자로 자르고 '...' 추가 -->
                    </p>
                    <div> <!-- 설명글-->
                        <!-- $^{news.source.name} * $^{news.publishedAt} 위에 경로 변수 만듦 -->
                        <div>${sourceName} * ${publishedDate}</div>
                    </div>
                </div>
            </div>`
            }
        ).join(''); //배열을 string타입으로 바꿔야겠다! > array to string javascript search

    console.log("html",newsHTML);
    document.getElementById('news-board').innerHTML=newsHTML;
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
    if (pageNum < 1) return;
    page = pageNum;
    getNews();
};
//getLatestNews();

//description이 200자 이상인 경우에만 잘라서 ...을 추가
const truncateText = (text, maxLength = 200) => {
    if (!text) return '내용이 없습니다.';
    if (text.length > maxLength) {
        return text.slice(0, maxLength) + '...';
    }
    return text;
};

//상대 시간 계산 함수 작성
function timeSince(date) {
    const now = new Date();
    const past = new Date(date);
    const secondsPast = Math.floor((now.getTime() - past.getTime()) / 1000);

    if (secondsPast < 60) {
        return `${secondsPast}초 전`;
    } else if (secondsPast < 3600) {
        return `${Math.floor(secondsPast / 60)}분 전`;
    } else if (secondsPast < 86400) {
        return `${Math.floor(secondsPast / 3600)}시간 전`;
    } else if (secondsPast < 2592000) {
        return `${Math.floor(secondsPast / 86400)}일 전`;
    } else if (secondsPast < 31104000) {
        return `${Math.floor(secondsPast / 2592000)}개월 전`;
    } else {
        return `${Math.floor(secondsPast / 31104000)}년 전`;
    }
}

//DOMContentLoaded 이벤트 사용
document.addEventListener("DOMContentLoaded", function() {
    //메뉴 버튼 클릭 이벤트 등록
    menus.forEach(menu =>
        menu.addEventListener("click", (event) => getNewsByCategory(event))
    );

    //검색 버튼 클릭 시 검색 실행
    document.getElementById("search-button").addEventListener("click", getNewsByKeyword);

    //검색 입력창에서 엔터키로 검색 실행
    document.getElementById("search-input").addEventListener("keydown", function(event) {
        if (event.key === "Enter") {
            getNewsByKeyword();
        }
    });

    //검색 아이콘 클릭 시 검색창 표시/숨김
    document.getElementById('search-icon').addEventListener('click', function() {
        const searchContainer = document.getElementById('search-container');
        searchContainer.classList.toggle('hidden');
        //검색창이 나타나면 입력 필드에 포커스
        if (!searchContainer.classList.contains('hidden')) {
            document.getElementById('search-input').focus();
        }
    });

    //초기 뉴스 로딩
    getLatestNews();
});

document.addEventListener("DOMContentLoaded", function() {
    // 기존 이벤트 리스너 등록 코드 유지

    // 햄버거 메뉴 및 사이드 메뉴 요소 선택
    const hamburgerMenu = document.querySelector('.hamburger-menu');
    const sideMenu = document.querySelector('.side-menu');
    const closeMenuBtn = document.querySelector('.close-menu');

    // 햄버거 메뉴 클릭 시 사이드 메뉴 표시
    hamburgerMenu.addEventListener('click', function() {
        sideMenu.classList.add('active');
    });

    // 닫기 버튼 클릭 시 사이드 메뉴 숨김
    closeMenuBtn.addEventListener('click', function() {
        sideMenu.classList.remove('active');
    });

    // 사이드 메뉴 내의 카테고리 버튼 클릭 시 메뉴 닫기 및 뉴스 로딩
    const sideMenuButtons = sideMenu.querySelectorAll('.side-menu-buttons button');
    sideMenuButtons.forEach(menu =>
        menu.addEventListener("click", (event) => {
            getNewsByCategory(event);
            sideMenu.classList.remove('active'); // 메뉴 닫기
        })
    );

    // 기존의 메뉴 버튼 클릭 이벤트 등록 (데스크톱용)
    const menus = document.querySelectorAll(".menus button");
    menus.forEach(menu =>
        menu.addEventListener("click", (event) => getNewsByCategory(event))
    );

    // 모바일용 검색 버튼 이벤트 리스너 등록
    document.getElementById("mobile-search-button").addEventListener("click", getNewsByMobileKeyword);

    // 모바일용 검색 입력창에서 엔터키로 검색 실행
    document.getElementById("mobile-search-input").addEventListener("keydown", function(event) {
        if (event.key === "Enter") {
            getNewsByMobileKeyword();
        }
    });

});



//1. 버튼들에 클릭 이벤트 주기
//2. 카테고리별 뉴스 가져오기
//3. 그 뉴스를 보여주기

