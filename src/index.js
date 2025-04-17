function getStudents() {
  return fetch("http://localhost:3000/students").then((reponse) =>
    reponse.json()
  );
}

function renderStudents(students) {
  document.querySelector("tbody").innerHTML = "";
  students.forEach((student) => {
    const status = student.isEnrolled ? "Записаний" : "Не записаний";
    const skills = student.skills.map((skill) => `<li>${skill}</li>`).join("");
    document.querySelector("tbody").insertAdjacentHTML(
      "beforeend",
      `<tr id="id-${student.id}">
        <td>${student.id}</td>
        <td>${student.name}</td>
        <td>${student.age}</td>
        <td>${student.course}</td>
        <td>
          <ul>${skills}</ul>
        </td>
        <td>${student.email}</td>
        <td>${status}</td>
        <td>
          <button data-action="change" class="change-btn">Змінити</button>
          <button data-action="delete" class="delete-btn">Видалити</button>
        </td>
      </tr>`
    );
  });
}

function addStudent(e) {
  e.preventDefault();
  const student = {
    name: document.querySelector("#name").value,
    course: document.querySelector("#course").value,
    age: document.querySelector("#age").value,
    skills: document
      .querySelector("#skills")
      .value.split(",")
      .map((skill) => skill.trim()),
    email: document.querySelector("#email").value,
    isEnrolled: document.querySelector("#isEnrolled").hasAttribute("checked"),
  };
  document.querySelector("#name").value = "";
  document.querySelector("#course").value = "";
  document.querySelector("#age").value = "";
  document.querySelector("#skills").value = "";
  document.querySelector("#email").value = "";
  fetch("http://localhost:3000/students", {
    method: "POST",
    body: JSON.stringify(student),
    headers: {
      "Content-Type": "application/json; charset=UTF-8",
    },
  });
  setTimeout(() => {
    getStudents().then((students) => {
      renderStudents(students);
    });
  }, 100);
}

// Функція для оновлення студента
function updateStudent(id) {
  // твій код
}

// Функція для видалення студента
function deleteStudent(id) {
  // твій код
}

document.querySelector("#get-students-btn").addEventListener("click", () => {
  getStudents().then((students) => {
    renderStudents(students);
  });
});

document.querySelectorAll(`input[type="checkbox"]`).forEach((item) => {
  item.addEventListener("click", (e) => {
    e.currentTarget.toggleAttribute("checked");
  });
});

document
  .querySelector("#add-student-form")
  .addEventListener("submit", addStudent);

let changedUserId = "";

document.querySelector("tbody").addEventListener("click", (e) => {
  if (e.target.classList.contains("change-btn")) {
    document.querySelector("#change").classList.remove("is-hidden");
    document.querySelector("body").classList.add("no-scroll");
    const studentId =
      e.target.parentElement.parentElement.firstElementChild.textContent;
    getStudents().then((students) => {
      const student = students.find((student) => student.id === studentId);
      changedUserId = student.id;
      document.querySelector("#change-name").value = student.name;
      document.querySelector("#change-course").value = student.course;
      document.querySelector("#change-age").value = student.age;
      document.querySelector("#change-skills").value =
        student.skills.join(", ");
      document.querySelector("#change-email").value = student.email;
      if (student.isEnrolled) {
        document
          .querySelector("#change-isEnrolled")
          .setAttribute("checked", "true");
      }
    });
  }
});

document.querySelector("#change-form").addEventListener("submit", (e) => {
  e.preventDefault();
  const student = {
    id: changedUserId,
    name: document.querySelector("#change-name").value,
    course: document.querySelector("#change-course").value,
    age: document.querySelector("#change-age").value,
    skills: document
      .querySelector("#change-skills")
      .value.split(",")
      .map((skill) => skill.trim()),
    email: document.querySelector("#change-email").value,
    isEnrolled: document
      .querySelector("#change-isEnrolled")
      .hasAttribute("checked"),
  };
  const studentItem = document.querySelector(`#id-${changedUserId}`);
  studentItem.children[1].textContent =
    document.querySelector("#change-name").value;
  studentItem.children[2].textContent =
    document.querySelector("#change-age").value;
  studentItem.children[3].textContent =
    document.querySelector("#change-course").value;
  const skills = document
    .querySelector("#change-skills")
    .value.split(",")
    .map((skill) => `<li>${skill.trim()}</li>`)
    .join("");
  studentItem.children[4].firstElementChild.innerHTML = skills;
  studentItem.children[5].textContent =
    document.querySelector("#change-email").value;
  studentItem.children[6].textContent = student.isEnrolled
    ? "Записаний"
    : "Не записаний";
  document.querySelector("#change").classList.add("is-hidden");
  document.querySelector("body").classList.remove("no-scroll");
  document.querySelector("#change-name").value = "";
  document.querySelector("#change-course").value = "";
  document.querySelector("#change-age").value = "";
  document.querySelector("#change-skills").value = "";
  document.querySelector("#change-email").value = "";
  fetch(`http://localhost:3000/students/${changedUserId}`, {
    method: "PUT",
    body: JSON.stringify(student),
    headers: {
      "Content-Type": "application/json; charset=UTF-8",
    },
  });
});

document.querySelector("tbody").addEventListener("click", (e) => {
  if (e.target.classList.contains("delete-btn")) {
    const studentId =
      e.target.parentElement.parentElement.firstElementChild.textContent;
    document.querySelector(`#id-${studentId}`).remove();
    fetch(`http://localhost:3000/students/${studentId}`, {
      method: "DELETE",
    });
  }
});

// 1. Реалізуйте функцію getStudents для отримання списку всіх студентів
// (HTTP GET /students) getStudents

// 2. Реалізуйте функцію addStudent для додавання нового студента (HTTP
// POST /students)

// 3. Реалізуйте функцію updateStudent  для часткового оновлення студента
// (HTTP PATCH /students/{id})

// 4. Реалізуйте функцію  для deleteStudent видалення студента за його
// ідентифікатором (HTTP DELETE /students/{id})

// 7. Написати JavaScript-код для обробки подій користувача.

// 7.1. Додати обробники подій для кнопок, щоб вони виконували відповідні
// HTTP-запити.

// 7.2. При натисканні на кнопку "Отримати студентів" (GET), виконати
// HTTP-запит GET /students і відобразити отримані дані в таблиці.

// 7.3. Реалізувати форму для додавання нового студента. При натисканні
// на кнопку "Додати студента" (POST), зібрати дані з полів вводу,
// сформувати об'єкт з даними  і виконати HTTP-запит POST /students, щоб
// додати нового студента до бази даних.

// 7.4. Реалізувати можливість оновлення інформації про студента.
// Для кожного студента в таблиці додати кнопку "Оновити". При натисканні
// на цю кнопку, виконати HTTP-запит PUT /students/:id, де :id —
// ідентифікатор фільму, і відправити оновлені дані про студента на сервер.

// 7.5. Додати можливість видалення студента. Для кожного студента в
// таблиці додати кнопку "Видалити". При натисканні на цю кнопку, виконати
// HTTP-запит DELETE /students/:id.
