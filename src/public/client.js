// Rover model class to store rover information
class Rover {
    constructor(roverData) {
        this.roverName = roverData.image.photos[0].rover.name;
        this.launchDate = roverData.image.photos[0].rover.launch_date;
        this.landingDate = roverData.image.photos[0].rover.landing_date;
        this.roverStatus = roverData.image.photos[0].rover.status;
        this.recentDate = roverData.image.photos[0].rover.max_date;
        this.imageSources = this.getLimitedRoverImagesSource(roverData);
    }

    // function to get first 20 (fast response time to user) image src URl from the responseData using map
    getLimitedRoverImagesSource(roverDataResponse) {
        let roverData = JSON.parse(JSON.stringify(roverDataResponse));
        let limitedRoverImages = roverData.image.photos.splice(1, 20);
        return limitedRoverImages.map(this.getRoverImageSource);
    }

    getRoverImageSource(roverImage) {
        return roverImage.img_src;
    }
}

// High-order function - render UI through callback function
async function processUI(roverName, callBack) {
    let data = await getRoverData(roverName);
    callBack(data);
}

// Calling `express server`
async function getRoverData(roverName) {

    const res = await fetch(`http://localhost:3000/nasaAPI`, {
        headers: {
            'roverName': roverName,
        }
    });
    let data = await res.json();

    if (!data.image.hasOwnProperty("errors")) {
        return processRoverData(data);
    }

    return data;
}

// A pure function to process rover data and parse it to `Rover` model
function processRoverData(responseData) {
    let roverData = JSON.parse(JSON.stringify(responseData));
    let rover = new Rover(roverData);
    return rover;
}

// A high order function to create dynamic UI Elements as per NASA MARS Rover - API response
function createDynamicUI(roverData) {

    if (roverData.hasOwnProperty("image")) {
        handleError();
    }
    else {
        let roverName = document.getElementById("roverName");
        roverName.innerHTML = roverData.roverName;

        let launchDate = document.getElementById("launchDate");
        launchDate.innerHTML = roverData.launchDate;

        let landingDate = document.getElementById("landingDate");
        landingDate.innerHTML = roverData.landingDate;

        let status = document.getElementById("status");
        status.innerHTML = roverData.roverStatus;

        let recentDate = document.getElementById("recentDate");
        recentDate.innerHTML = roverData.recentDate;

        let imageGallery = document.getElementById("roverImages");
        imageGallery.innerHTML = "";

        for (let roverImage of roverData.imageSources) {

            let imageEle = document.createElement("img");
            imageEle.setAttribute("src", roverImage)
            imageEle.setAttribute("class", "col-md-3 my-3");

            imageGallery.appendChild(imageEle);
        }
        document.getElementById("roverMetaInfo").style.visibility = 'visible';
        document.getElementById("roverImages").style.visibility = 'visible';
        document.getElementById("errorBox").style.visibility = 'collapse';
    }

}

// Rendering error message to UI, if NASA API call fails
function handleError() {
    let roverMetaInfo = document.getElementById("roverMetaInfo");
    let errorBox = document.getElementById("errorBox");
    errorBox.style.color = "red";
    errorBox.innerHTML = "Error may be due to NASA API is not working properly.";
    errorBox.style.visibility = 'visible';
    roverMetaInfo.style.visibility = 'collapse';

    let imageGallery = document.getElementById("roverImages");
    imageGallery.style.visibility = 'collapse';
}