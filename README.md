# Cloud Computing exam simulator

Simple React app to simulate the Cloud Computing written "exam" @ Sapienza University of Rome.

**DISCLAIMER**: since this simulator has been developed just to have a simple working tool, this code may not be the cleanest in the world, feel free to refactor it and open a PR :)

## Run with Docker
Please if you don't have Docker [install it](https://docs.docker.com/get-docker/).
After Docker has been installed, from the root directory where the Dockerfile is, you can simply run:

```sh
docker build . -t cloud_simulator
docker run --rm -i -p 80:3000 cloud_simulator
```

Otherwise, you can directly use the image from docker hub (may not be always up to date): 

```sh
docker run --rm -i -p 80:3000 lmriccardo/cloud_simulator
```

The simulation is going to be available at [`localhost:80`](http://localhost:80/).

## Build from source
If you do not have Docker installed or want to build and run the simulator from source

### Dependencies

- Node.js
- `npm`

Be sure to have all the Node dependencies installed:

```sh
npm install
```

### Run the simulation

```sh
npm run start
```

## Contributions

If you want to contribute to the "database" of questions, simply edit the [`questions.json`](src/assets/questions.json) and open a Pull Request.
Every new question should have the following entries:
- `question`: a string with the question
- `options`: an array of possible answers
- `answer`: the index (starts from 0) of the correct answer among the ones in the `options` array
- `occurrences`: an array of exam/simulation dates in which the question occurred
- `figure`: an optional field for the name of a figure that should be shown (to add new images upload them in the [`src/assets/images`](src/assets/images) directory and accordingly update the `mapImages` dictionary in [`App.js`](src/App.js))

## Authors

- [Andrea Gasparini](https://github.com/andrea-gasparini)
- [Edoardo Di Paolo](https://github.com/aedoardo)
