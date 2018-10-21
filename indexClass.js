const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December"
];

const daysOfWeek = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday"
];

const container = document.getElementById("container");
container.id = "container";

const globalArr = [];

function getWeeksForMonth(month, year) {
  const firstOfMonth = new Date(year, month, 1);
  const firstDayOfWeek = firstOfMonth.getDay();
  const weeks = [[]];
  const WEEK_LENGTH = 7;
  let currentWeek = weeks[0];
  let currentDate = firstOfMonth;

  for (let i = 0; i < firstDayOfWeek; i++) {
    currentWeek.push("-");
  }

  while (currentDate.getMonth() === month) {
    if (currentWeek.length === WEEK_LENGTH) {
      currentWeek = [];
      weeks.push(currentWeek);
    }

    currentWeek.push(currentDate.getDate());
    currentDate = new Date(year, month, currentDate.getDate() + 1);
  }

  while (currentWeek.length < 7) {
    currentWeek.push("-");
  }

  return weeks;
}

const pushYears = (numberOfYears, firstYear) => {
  for (let i = 0; i < numberOfYears; i++) {
    year = [];
    for (let j = 0; j < 12; j++) {
      year.push({
        weeks: getWeeksForMonth(j, firstYear + i),
        month: j,
        year: firstYear + i
      });
    }
    globalArr.push(year);
  }
};

pushYears(1, 2018);

window.onload = function() {
  if (localStorage.getItem("hasCodeRunBefore") === null) {
    localStorage.setItem("hasCodeRunBefore", JSON.stringify(globalArr));
  }
};

class GenerateOnPage {
  constructor(globalArr) {
    this.globalArr =
      JSON.parse(localStorage.getItem("hasCodeRunBefore")) || globalArr;
    console.log(this.globalArr);
  }

  generate() {
    container.innerHTML = "";
    this.globalArr.forEach(yearElement => this.createYear(yearElement));
  }
  createDay(
    yearElement,
    monthElement,
    weekElement,
    weekElementIndex,
    dayElement,
    div
  ) {
    const stupidDiv = document.createElement("div");
    const myPlace = this.globalArr[0][monthElement.month].weeks[
      weekElementIndex
    ];
    const index = myPlace.indexOf(dayElement);
    const p = document.createElement("p");
    p.innerText = dayElement.dayElement ? dayElement.dayElement : dayElement;
    const todo = document.createElement("p");
    todo.innerText =
      myPlace[index].todo === undefined ? "" : myPlace[index].todo;
    stupidDiv.className = myPlace[index].todo !== undefined ? "blue" : "";
    stupidDiv.appendChild(p);
    stupidDiv.appendChild(todo);

    if (
      new Date().getFullYear() === yearElement[0].year &&
      new Date().getMonth() === monthElement.month &&
      new Date().getDate() === dayElement
    ) {
      stupidDiv.classList.add("red");
    } else if (
      (dayElement === weekElement[6] || dayElement === weekElement[0]) &&
      dayElement !== "-"
    ) {
      stupidDiv.classList.add("yellow");
    }
    stupidDiv.ondblclick = () => {
      const input = document.createElement("input");

      if (!stupidDiv.querySelector("input")) {
        stupidDiv.appendChild(input);
      }

      input.onkeydown = e => {
        if (e.keyCode === 13) {
          if (!myPlace[index].dayElement) {
            myPlace[index] = {
              dayElement,
              todo: e.target.value
            };
          }
          stupidDiv.removeChild(input);
          localStorage.setItem(
            "hasCodeRunBefore",
            JSON.stringify(this.globalArr)
          );
          this.generate();
        }
      };
      todo.className = "suka";
    };

    div.appendChild(stupidDiv);
  }

  createWeek(
    yearElement,
    monthElement,
    weekElement,
    weekElementIndex,
    weekDiv
  ) {
    const div = document.createElement("div");
    div.className = "contInside";
    weekElement.forEach(dayElement =>
      this.createDay(
        yearElement,
        monthElement,
        weekElement,
        weekElementIndex,
        dayElement,
        div
      )
    );
    weekDiv.appendChild(div);
  }

  createMonth(yearElement, monthElement, yearContainer, yearWrapper) {
    const contDiv = document.createElement("div");
    contDiv.className = "contDiv";
    contDiv.id = months[monthElement.month] + "__" + yearElement[0].year;
    const p = document.createElement("p");
    const monthAndButtons = document.createElement("div");
    monthAndButtons.className = "months-and-buttons";
    const buttonPrev = document.createElement("button");
    const buttonNext = document.createElement("button");
    buttonPrev.innerText = "<-";
    buttonNext.innerText = "->";
    buttonPrev.onclick = () => {
      let left = yearContainer.style.left;
      if (+left.split("px")[0] < -24.75) {
        let leftStyle = +left.split("px")[0];
        leftStyle += 752;
        console.log(left, leftStyle);
        yearContainer.style.left = leftStyle + "px";
      }
    };
    buttonNext.onclick = () => {
      let left = yearContainer.style.left;
      if (+left.split("px")[0] >= -8293.5) {
        let leftStyle = +left.split("px")[0];
        leftStyle -= 752;
        console.log(left, leftStyle);
        yearContainer.style.left = leftStyle + "px";
      }
    };

    if (monthElement.month === new Date().getMonth()) {
      yearContainer.style.left = new Date().getMonth() * -754.75 + "px";
      console.log(yearContainer.style.left);
    }
    p.innerText = months[monthElement.month];

    monthAndButtons.appendChild(buttonPrev);
    monthAndButtons.appendChild(p);
    monthAndButtons.appendChild(buttonNext);
    contDiv.appendChild(monthAndButtons);

    let days = document.createElement("div");
    daysOfWeek.forEach(e => {
      let div = document.createElement("div");
      let p = document.createElement("p");
      p.innerText = e.substr(0, 3);
      div.appendChild(p);
      days.appendChild(div);
    });
    days.className = "contInside";
    contDiv.appendChild(days);

    monthElement.weeks.forEach((weekElement, weekElementIndex) =>
      this.createWeek(
        yearElement,
        monthElement,
        weekElement,
        weekElementIndex,
        contDiv
      )
    );

    yearContainer.appendChild(contDiv);
  }

  createYear(yearElement) {
    const yearContainer = document.createElement("div");
    const yearWrapper = document.createElement("div");
    yearWrapper.className = "year-wrapper";
    yearContainer.className = "year-container";
    yearContainer.id = yearElement[0].year;
    const p = document.createElement("p");
    p.innerText = yearElement[0].year;
    yearElement.forEach(monthElement =>
      this.createMonth(yearElement, monthElement, yearContainer, yearWrapper)
    );
    yearWrapper.appendChild(yearContainer);
    container.appendChild(p);
    container.appendChild(yearWrapper);
  }
}

const Calendar = new GenerateOnPage(globalArr);
Calendar.generate();
