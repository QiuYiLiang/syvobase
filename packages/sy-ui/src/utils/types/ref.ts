import { ValidateOtpions } from "./props"

export interface BaseInputModel {
  validation: (options?: ValidateOtpions) => Promise<boolean>
}
export interface BaseTriggerUpdateModel {
  triggerUpdate: () => void
}
