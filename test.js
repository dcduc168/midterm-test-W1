fetch("/current", {
  method: "get",
})
  .then((response) => {
    return response.text();
  })
  .then((data) => {
    data = JSON.parse(data);
    document.getElementById(
      "current"
    ).innerHTML = `Con mèo đã click đến URL có số thứ tự là ${data["current"]}.`;
  });

function setInfo(event) {
  event.preventDefault();

  data = { url: event.target.elements.url.value };
  fetch("/visit", {
    method: "post",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((response) => {
      return response.text();
    })
    .then((data) => {
      data = JSON.parse(data);
      if (data["status"] == "Sent") {
        document.getElementById(
          "result"
        ).innerHTML = `Đã gửi cho con mèo. Thứ tự của bạn là ${data["id"]}.`;
      } else if (data["status"] === "Invalid") {
        document.getElementById("result").innerHTML = `URL không hợp lệ.`;
      } else {
        document.getElementById("result").innerHTML =
          "Error: Something went wrong";
      }
    })
    .then(
      setTimeout(function () {
        location.reload();
      }, 5000)
    );
}
