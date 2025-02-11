console.log('Lets write some Java Script');
let currfolder;
let songs;
let currentsong = new Audio();


function convertToMinutesSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }
    // Calculate the minutes by dividing the seconds by 60
    const minutes = Math.floor(seconds / 60);

    // Calculate the remaining seconds
    const remainingSeconds = Math.floor(seconds % 60);

    // Return the result in "minutes:seconds" format
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}


async function getsongs(folder) {
    currfolder = folder;
    // To get songs list from the folder
    let a = await fetch(`/${folder}/`)
    let response = await a.text();
    // console.log(a2);
    let div = document.createElement("div")
    div.innerHTML = response;
    let as = div.getElementsByTagName("a")
    // console.log(anchors);
    songs = []
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split(`/${folder}/`)[1])
        }

    }
    // console.log(songs);


    // To add all the songs in the library
    let songul = document.querySelector(".songslist ").getElementsByTagName("ul")[0]
    songul.innerHTML = ""
    for (const song of songs) {
        songul.innerHTML = songul.innerHTML + `<li>
        
        
        <img src="img/music.svg" alt="music">
        
        <div class="info">
        <div class="songname">${song.replaceAll("%20", " ")}
        </div>
        <div class="artistname"></div>
        </div>
        <div class="playnow">
        Playnow
        <img src="img/playnow.svg" alt="playnow">
        </div>
        
        
        </li>`



    }

    // Adding event listener to each song
    Array.from(document.querySelector(".songslist").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", element => {
            playmusic(e.querySelector(".songname").innerHTML.trim())
        })

    });

    return songs



}

const playmusic = (track, pause = false) => {
    // let audio = new Audio("/songs/"+ track)
    // audio.play()
    currentsong.src = `/${currfolder}/` + track
    if (!pause) {

        currentsong.play()
        play.src = "img/pause.svg"
    }
    document.querySelector(".songinfo").innerHTML = decodeURI(track)
    document.querySelector(".duration").innerHTML = "00:00 / 00:00"


}

async function displayAlbums() {
    let a = await fetch(`/songs/`)
    let response = await a.text();
    let div = document.createElement("div")
    div.innerHTML = response;
    let anchors = div.getElementsByTagName("a")

    let cardContainer = document.querySelector(".cardcontainer")
    let array = Array.from(anchors)
    // console.log(array)
    for (let index = 0; index < array.length; index++) {
        const e = array[index];
        if (e.href.includes("/songs/") && !e.href.includes(".htaccess")) {
            let folder = e.href.split("/").slice(-2)[1]
            // Get the metadata of the folder
            // console.log(folder)
            let a = await fetch(`/songs/${folder}/info.json`)
            let response = await a.json();
            cardContainer.innerHTML = cardContainer.innerHTML + ` <div data-folder="${folder}" class="card">

                        <img class="cardkiimg" src="/songs/${folder}/cover.jpg" alt="cover">
                        <h4>${response.title} </h4>
                        <p>${response.description}</p>
                        <img class="playbutton" src="img/play.svg" alt="playbutton">

        </div>`
        }
    }

    // Load the playlist whenever card is clicked
    Array.from(document.getElementsByClassName("card")).forEach(e => {
        e.addEventListener("click", async item => {
            // console.log("Fetching Songs")
            songs = await getsongs(`songs/${item.currentTarget.dataset.folder}`)
            playmusic(songs[0])

        })
    })
}


async function main() {


    // To get songs list from the folder
    await getsongs("songs/alec")
    playmusic(songs[0], true)
    // console.log(songs);

    // Display all the albums on the page

    await displayAlbums()

    // Adding event listener to play and pause 
    play.addEventListener("click", () => {

        if (currentsong.paused) {
            currentsong.play()
            play.src = "img/pause.svg";
        }
        else {
            currentsong.pause()
            play.src = "img/musicplay.svg"
        }

    })



    //Add an event listener to previous and next
    previous.addEventListener("click", () => {
        // currentsong.pause()
        let index = songs.indexOf(currentsong.src.split("/").slice(-1)[0])
        if ((index - 1) >= 0) {
            playmusic(songs[index - 1])
        }
        else {
            alert('No previous song available, Song paused!')
            currentsong.pause()
            play.src = "img/musicplay.svg"
        }

    })




    next.addEventListener("click", () => {
        // currentsong.pause()
        let index = songs.indexOf(currentsong.src.split("/").slice(-1)[0])
        if ((index + 1) < songs.length) {
            playmusic(songs[index + 1])
        }
        else {
            alert('No next song available, Song paused!')
            currentsong.pause()
            play.src = "img/musicplay.svg"
        }
    })




    // Adding event listener to play and pause using keyboard
    document.addEventListener('keydown', function (event) {
        if (event.code === 'Space') {
            if (currentsong.paused) {
                currentsong.play()
                play.src = "img/pause.svg"
            }
            else {
                currentsong.pause()
                play.src = "img/musicplay.svg"
            }

        }
    });




    // Timeupdate event listener and seekbar update
    currentsong.addEventListener("timeupdate", () => {
        document.querySelector(".duration").innerHTML = `${convertToMinutesSeconds(currentsong.currentTime)}/${convertToMinutesSeconds(currentsong.duration)}`
        // console.log(currentsong.currentTime,currentsong.duration)
        document.querySelector(".circle").style.left = (currentsong.currentTime / currentsong.duration) * 100 + "%";
        // Autoplay next song
        if (currentsong.currentTime / currentsong.duration == 1) {
            let index = songs.indexOf(currentsong.src.split("/").slice(-1)[0])
            if ((index + 1) < songs.length) {
                playmusic(songs[index + 1])
            }
            else {
                alert('No next song available, Song paused!')
                currentsong.pause()
                play.src = "img/musicplay.svg"
            }

        }

    })



    //adding eventlistener to seekbar

    document.querySelector(".seekbar").addEventListener("click", (e) => {
        // console.log(e.target.getBoundingClientRect().width)
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
        document.querySelector(".circle").style.left = percent + "%";
        currentsong.currentTime = (percent * (currentsong.duration)) / 100;


    })



    // ADDING EVENTLISTENER TO VOLUME
    document.querySelector(".volume ").getElementsByTagName("input")[0].addEventListener("input", (e) => {
        currentsong.volume = (e.target.value) / 100
        if (((e.target.value) / 100) == 0) {
            document.querySelector(".volume img").src = "img/mute.svg"
        }
        else if (((e.target.value) / 100) < 0.4) {
            document.querySelector(".volume img").src = "img/lowvolume.svg"
        }
        else {
            document.querySelector(".volume img").src = "img/fullvolume.svg"
        }
    })


    // Add event listener to mute the track
    document.querySelector(".volume > img").addEventListener("click", e => {
        // pvol=currentsong.volume
        // console.log(pvol)
        if (e.target.src.includes("fullvolume.svg")) {
            e.target.src = e.target.src.replace("img/fullvolume.svg", "img/mute.svg")
            currentsong.volume = 0;
            document.querySelector(".volume").getElementsByTagName("input")[0].value = 0;
        }
        else if (e.target.src.includes("lowvolume.svg")) {
            e.target.src = e.target.src.replace("img/lowvolume.svg", "img/mute.svg")
            currentsong.volume = 0;
            document.querySelector(".volume").getElementsByTagName("input")[0].value = 0;
        }
        else {
            e.target.src = e.target.src.replace("img/mute.svg", "img/fullvolume.svg")
            currentsong.volume = 0.6;
            document.querySelector(".volume").getElementsByTagName("input")[0].value = 60;
        }

    })


    // Add an event listener for hamburger
    document.querySelector(".hamburger").addEventListener("click", () => {
        document.querySelector(".left").style.left = "0%"
        // document.querySelector(".right").style.display = "100%"

    })

    // Add an event listener for close button
    document.querySelector(".close").addEventListener("click", () => {
        document.querySelector(".left").style.left = "-100%"
        // document.querySelector(".right").style.display = "-96%"

    })
    // Adding event listener when resize the screen
    let alertShown = false;

    window.addEventListener('resize', function () {
        if (window.innerWidth < 800 && !alertShown) {
            alert('Your screen width is now less than 800px!');
            alert('Use hamburger (3-lines) option to see the library!');
            alertShown = true; // Set the flag to true after showing the alert
        } else if (window.innerWidth >= 800) {
            alertShown = false; // Reset the flag if the screen is resized back to 800px or more
        }
    });

    // Add an event listener for keydown  events
    document.addEventListener('keydown', function (event) {
        if (event.key === 'ArrowLeft') {
            // currentsong.pause()
            let index = songs.indexOf(currentsong.src.split("/").slice(-1)[0])
            if ((index - 1) >= 0) {
                playmusic(songs[index - 1])
            }
            else {
                alert('No previous song available, Song paused!')
                currentsong.pause()
                play.src = "img/musicplay.svg"
            }


        }
    });

    document.addEventListener('keydown', function (event) {
        if (event.key === 'ArrowRight') {
            // currentsong.pause()
            let index = songs.indexOf(currentsong.src.split("/").slice(-1)[0])
            if ((index + 1) < songs.length) {
                playmusic(songs[index + 1])
            }
            else {
                alert('No next song available, Song paused!')
                currentsong.pause()
                play.src = "img/musicplay.svg"
            }

        }
    });




}

main()
