import axios from 'axios'

const URI = 'http://challenge.teespring.com/v1'
const TOKEN = ''

const inksApi =
  'https://mocki.io/v1/9b7c9716-1d8a-4f09-a08f-e0730eda3cdb'
const questionApi =
  'https://mocki.io/v1/02f13c8f-d061-4eab-939b-77ee7180dc52'

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
  const { data } = await axios.get(inksApi, {
    headers: {
      'Auth-Token': `${TOKEN}`,
    },
  })
  return data
}

const getQuestions = async () => {
  const { data } = await axios.get(questionApi, {
    headers: {
      'Auth-Token': `${TOKEN}`,
    },
  })
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

const questionsObj = async () => {
  let totalVolume = 0
  const data = await getQuestions()
  data.questions.map((item: any) =>
    item.layers.map(({volume}: any) => totalVolume += volume)
  )
  console.log(totalVolume)
}

const getAcceptableColors = async (
  color: string,
  target: number,
) => {
  const goodColors = new Map()
  const inkObj = await getInks()

  inkObj.inks.map((ink: Ink) => {
    if (
      getEuclidean(
        convertHex(color),
        convertHex(ink.color),
      ) < target
    ) {
      goodColors.set(`${ink.color}`, ink.cost)
    }
  })
  
  questionsObj()
  console.log(goodColors)
  return goodColors
}

getAcceptableColors('#b0e0c1', 12.3)
