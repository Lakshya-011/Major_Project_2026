const petContainer = document.getElementById("featuredPets");

async function loadFeaturedPets() {
    try {

        const response = await fetch(`${BASE_URL}/pets`);

        const data = await response.json();

        if (!data.success) {
            petContainer.innerHTML = `
                <h3 class="text-center">
                    No Pets Found
                </h3>
            `;
            return;
        }

        displayPets(data.pets);

    } catch (error) {

        console.error(error);

        petContainer.innerHTML = `
            <h3 class="text-center text-danger">
                Something went wrong.
            </h3>
        `;

    }
}

function displayPets(pets) {

    petContainer.innerHTML = "";

    pets.forEach((pet) => {

        let imageUrl = "https://placehold.co/600x400?text=No+Image";

        // New Cloudinary Format
        if (
            pet.image &&
            typeof pet.image === "object" &&
            pet.image.url
        ) {
            imageUrl = pet.image.url;
        }

        // Old Local Upload Format
        else if (
            pet.image &&
            typeof pet.image === "string"
        ) {
            imageUrl = "http://localhost:5000/uploads/" + pet.image;
        }

        petContainer.innerHTML += `

            <div class="col-lg-4 col-md-6 mb-4">

                <div class="card h-100 shadow">

                    <img
                        src="${imageUrl}"
                        class="card-img-top"
                        style="height:250px;object-fit:cover;"
                        alt="${pet.petName}">

                    <div class="card-body">

                        <h5 class="card-title">
                            ${pet.petName}
                        </h5>

                        <p class="card-text">
                            <strong>Breed:</strong>
                            ${pet.breed}
                        </p>

                        <p class="card-text">
                            <strong>Location:</strong>
                            ${pet.location}
                        </p>

                        <p class="card-text">
                            <strong>Age:</strong>
                            ${pet.age} Years
                        </p>

                        <a
                            href="pet.html?id=${pet._id}"
                            class="btn btn-warning w-100">

                            View Details

                        </a>

                    </div>

                </div>

            </div>

        `;

    });

}

loadFeaturedPets();