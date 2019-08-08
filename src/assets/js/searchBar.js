document.getElementById("search-form").addEventListener("submit", e => {
    e.preventDefault();
    let query = document.getElementById('query').value;

    return window.location.href=`/search/${query}`;
})