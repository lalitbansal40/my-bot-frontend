import axiosServices from "utils/axios";

class ChannelService {
  async getChannels() {
    const response = await axiosServices.get(`channel`);

    return response.data;
  }
}

export const channelService = new ChannelService();
