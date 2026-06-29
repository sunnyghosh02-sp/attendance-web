import { db } from "./firebase.js";

import {
    collection,
    doc,
    setDoc,
    serverTimestamp,
    onSnapshot,
    query,
    orderBy
} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";

const attendanceRef = collection(db, "attendance");

const nameInput = document.getElementById("nameInput");
const searchInput = document.getElementById("searchInput");
const submitBtn = document.getElementById("submitBtn");

const loader = document.getElementById("loader");
const toast = document.getElementById("toast");

const goingList = document.getElementById("goingList");
const notGoingList = document.getElementById("notGoingList");

const totalCount = document.getElementById("totalCount");
const goingCount = document.getElementById("goingCount");
const notGoingCount = document.getElementById("notGoingCount");

const goingNumber = document.getElementById("goingNumber");
const notGoingNumber = document.getElementById("notGoingNumber");

let attendanceData = [];

submitBtn.addEventListener("click", saveAttendance);

async function saveAttendance() {

    let name = nameInput.value.trim();

    if (name === "") {
        alert("Please enter your name.");
        return;
    }

    name = name.toLowerCase();

    const selectedStatus =
        document.querySelector(
            'input[name="status"]:checked'
        ).value;

    submitBtn.disabled = true;
    loader.style.display = "flex";

    try {

        await setDoc(
            doc(db, "attendance", name),
            {
                name: capitalize(name),
                status: selectedStatus,
                updatedAt: serverTimestamp()
            }
        );

        toast.textContent = "Attendance saved successfully!";
        showToast();
        nameInput.value = "";

    } catch (error) {

        console.error(error);
        alert(
            "Couldn't save attendance.\nPlease check your internet connection and try again."
        );

    } finally {

        loader.style.display = "none";
        submitBtn.disabled = false;

    }

}

const q = query(attendanceRef, orderBy("updatedAt", "desc"));

onSnapshot(q, (snapshot) => {

    attendanceData = [];

    snapshot.forEach((doc) => {
        attendanceData.push(doc.data());
    });

    renderAttendance();

});

function renderAttendance() {

    const search = searchInput.value.trim().toLowerCase();

    goingList.innerHTML = "";
    notGoingList.innerHTML = "";

    let total = 0;
    let going = 0;
    let notGoing = 0;

    attendanceData
        .filter(person =>
            person.name.toLowerCase().includes(search)
        )
        .forEach(data => {

            total++;

            let time = "";

            if (data.updatedAt && data.updatedAt.toDate) {
                time = data.updatedAt
                    .toDate()
                    .toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit"
                    });
            }

            const card = `
            <div class="person ${data.status}">
                <div><strong>${data.name}</strong></div>
                <div class="time">${time}</div>
            </div>
            `;

            if (data.status === "going") {
                going++;
                goingList.innerHTML += card;
            } else {
                notGoing++;
                notGoingList.innerHTML += card;
            }

        });

    if (going === 0)
        goingList.innerHTML = "<p>No responses yet.</p>";

    if (notGoing === 0)
        notGoingList.innerHTML = "<p>No responses yet.</p>";

    totalCount.textContent = total;
    goingCount.textContent = going;
    notGoingCount.textContent = notGoing;

    goingNumber.textContent = going;
    notGoingNumber.textContent = notGoing;

}

function capitalize(text) {

    return text
        .split(" ")
        .map(word =>
            word.charAt(0).toUpperCase() +
            word.slice(1)
        )
        .join(" ");

}

function showToast() {

    toast.style.display = "block";

    setTimeout(() => {

        toast.style.display = "none";

    }, 2000);

}

searchInput.addEventListener("input", renderAttendance);

nameInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        saveAttendance();
    }
});
