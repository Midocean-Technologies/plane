import APIService from "./api.service";
import trackEventServices from "./track-event.service";
// types
import { ICurrentUserResponse, IGptResponse } from "types";

const { NEXT_PUBLIC_API_BASE_URL } = process.env;

const trackEvent =
  process.env.NEXT_PUBLIC_TRACK_EVENTS === "true" ||
  process.env.NEXT_PUBLIC_TRACK_EVENTS === "1";

export class AIServices extends APIService {
  constructor() {
    super(NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000");
  }

  async createGptTask(
    workspaceSlug: string,
    projectId: string,
    data: { prompt: string; task: string },
    user: ICurrentUserResponse | undefined
  ): Promise<IGptResponse> {
    return this.post(
      `/api/workspaces/${workspaceSlug}/projects/${projectId}/ai-assistant/`,
      data
    )
      .then((response) => {
        if (trackEvent)
          trackEventServices.trackAskGptEvent(response?.data, "ASK_GPT", user);
        return response?.data;
      })
      .catch((error) => {
        throw error?.response;
      });
  }
}
