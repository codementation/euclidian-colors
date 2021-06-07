import axios from 'axios'

const URI = 'http://challenge.teespring.com/v1'
const TOKEN = ''

type Ink = {
  id: string
  color: string
  cost: number
}

type Color = {
  red: number
  green: number
  blue: number
}

const getInks = async () => {
  const { data } = await axios.get(`${URI}/inks`, {
    headers: {
      'Auth-Token': `${TOKEN}`,
    },
  })
  return data
}

const getQuestions = async () => {
  const { data } = await axios.get(
    `${URI}/question/evaluate`,
    {
      headers: {
        'Auth-Token': `${TOKEN}`,
      },
    },
  )
  return data
}

const convertHex = (color: string) => {
  const hex = color.replace(/^#/, '')
  const number = Number.parseInt(hex.slice(0, 6), 16)
  const red = number >> 16
  const green = (number >> 8) & 255
  const blue = number & 255
  return { red: red, green: green, blue: blue }
}

const getEuclidean = (color1: Color, color2: Color) => {
  return Math.sqrt(
    Math.pow(color2.red - color1.red, 2) +
      Math.pow(color2.green - color1.green, 2) +
      Math.pow(color2.blue - color1.blue, 2),
  )
}

const questions = getQuestions()
  .then((data) => data)
  .catch((err) => err)

const getAcceptableColors = async (
  color: string,
  target: number,
) => {
  const inks = await getInks()
  console.log(inks)
  const goodColors = new Map()
  inks.map((ink: Ink) => {
    if (
      getEuclidean(
        convertHex(color),
        convertHex(ink.color),
      ) < target
    ) {
      goodColors.set(`${ink.color}`, ink.cost)
    }
  })
}
