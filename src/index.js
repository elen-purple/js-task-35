async function getStudents() {
  try {
    return await fetch(
      "https://6815f77332debfe95dbcf78b.mockapi.io/js-task-35/students"
    ).then((reponse) => reponse.json());
  } catch (e) {
    return e;
  }
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

async function addStudent(e) {
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
  try {
    await fetch(
      "https://6815f77332debfe95dbcf78b.mockapi.io/js-task-35/students",
      {
        method: "POST",
        body: JSON.stringify(student),
        headers: {
          "Content-Type": "application/json; charset=UTF-8",
        },
      }
    );
  } catch (e) {
    return e;
  }
  await getStudents().then((students) => {
    renderStudents(students);
  });
}

document
  .querySelector("#get-students-btn")
  .addEventListener("click", async () => {
    await getStudents().then((students) => {
      console.log(students);
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

document.querySelector("tbody").addEventListener("click", async (e) => {
  if (e.target.classList.contains("change-btn")) {
    document.querySelector("#change").classList.remove("is-hidden");
    document.querySelector("body").classList.add("no-scroll");
    const studentId =
      e.target.parentElement.parentElement.firstElementChild.textContent;
    await getStudents().then((students) => {
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

document.querySelector("#change-form").addEventListener("submit", async (e) => {
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
  document.querySelector("#change").classList.add("is-hidden");
  document.querySelector("body").classList.remove("no-scroll");
  document.querySelector("#change-name").value = "";
  document.querySelector("#change-course").value = "";
  document.querySelector("#change-age").value = "";
  document.querySelector("#change-skills").value = "";
  document.querySelector("#change-email").value = "";
  try {
    await fetch(
      `https://6815f77332debfe95dbcf78b.mockapi.io/js-task-35/students/${changedUserId}`,
      {
        method: "PUT",
        body: JSON.stringify(student),
        headers: {
          "Content-Type": "application/json; charset=UTF-8",
        },
      }
    );
  } catch (e) {
    return e;
  }
  await getStudents().then((students) => {
    renderStudents(students);
  });
});

document.querySelector("tbody").addEventListener("click", async (e) => {
  if (e.target.classList.contains("delete-btn")) {
    const studentId =
      e.target.parentElement.parentElement.firstElementChild.textContent;
    try {
      await fetch(
        `https://6815f77332debfe95dbcf78b.mockapi.io/js-task-35/students/${studentId}`,
        {
          method: "DELETE",
        }
      );
    } catch (e) {
      return e;
    }
    await getStudents().then((students) => {
      renderStudents(students);
    });
  }
});
