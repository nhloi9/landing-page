import mongo from './mongo'

const connect = async (): Promise<any> => {
  try {
    await mongo.connect()
    console.info('[database]-[mongo] connected')
    return await new Promise((resolve, _reject) => {
      resolve(true)
    })
  } catch (error) {
    return await new Promise((_resolve, reject) => {
      reject(error)
    })
  }
}

export default { connect }
