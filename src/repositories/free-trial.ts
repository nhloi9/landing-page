import { FreeTrial } from '../models'
import { type IFreeTrial } from '../types'

const createFreeTrial = async (freeTrial: IFreeTrial): Promise<IFreeTrial> => {
  const newFreeTrial = new FreeTrial(freeTrial)
  return await newFreeTrial.save()
}

export { createFreeTrial }
