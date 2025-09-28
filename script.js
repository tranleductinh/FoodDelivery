const grid = document.getElementById("grid");
const counter = document.getElementById("counter");
const st = document.getElementById("status");
let data = [];
async function getFood() {
  try {
    st.classList.replace(st.classList.value, "loading");
    skeleton();
    const response = await fetch(
      "https://68aad6e8909a5835049d1f7a.mockapi.io/foods"
    );
    if (!response.ok) {
      throw new Error("Lỗi mãng hoặc API");
    }
    data = await response.json();
    console.log("data: ", data);
    renderFood(data);
  } catch (error) {
    st.style.display = "block";
    st.classList.replace(st.classList.value, "error");
    st.innerHTML = `
    <div style="text-align:center; display:grid; gap:10px">
          <div style="font-weight:700; color: #ef4444">
            Không tải được dữ liệu<br><code>${error.message}</code>
          </div>
          <button class="add__food" id="retry">Thử lại</button>
        </div>
    `;
    document.getElementById("retry").addEventListener("click", (e) => {
      getFood();
    });
  }
}
getFood();

function skeleton() {
  for (i = 0; i < 10; i++) {
    grid.innerHTML += `
    <article class="card">
      <div class="thumb skeleton"></div>
      <div class="body">
        <div class="name skeleton" style="height:18px; width:70%; margin:0 0 8px"></div>
        <div class="skeleton" style="height:12px; width:100%; margin:6px 0"></div>
        <div class="skeleton" style="height:12px; width:80%; margin:6px 0"></div>
        <div class="row" style="margin-top:12px">
          <div class="skeleton" style="height:20px; width:80px;"></div>
          <div class="skeleton" style="height:32px; width:76px;"></div>
        </div>
      </div>
    </article>
    `;
  }
}

function renderFood(data) {
  const searchFood = document.getElementById("searchFood").value;
  if (searchFood.length > 0) {
    data = data.filter((food) =>
      food.name.toLowerCase().includes(searchFood.toLowerCase())
    );
    console.log(data);
  }
  if (data.length == 0) {
    st.innerText = `Không có món nào phù hợp với từ khoá tìm kiếm.`;
    st.classList.replace(st.classList.value, "empty");
    st.style.display = "block";
  } else {
    st.style.display = "none";
  }
  counter.innerHTML = `${data.length} món`;
  grid.innerHTML = data
    .map((food) => {
      return `
            <article class="card">
            <span class="badge">${food.category}</span>
            <img
              class="thumb"
              src="${food.image}"
              alt="Phở Bò"
              loading="lazy"
            />
            <div class="body">
              <h3 class="name">${food.name}</h3>
              <p class="desc">
                ${food.description}
              </p>
              <div class="row">
                <span class="price">${food.price} VND</span>
                <button class="add__food">Thêm</button>
              </div>
            </div>
          </article>
        `;
    })
    .join("");
}

window.addEventListener("input", (e) => {
  e.preventDefault();
  renderFood(data);
});
