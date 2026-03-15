import axiosServices from "utils/axios";

class ContactService {
  async getContacts(channelId: string, search?: string) {
    const response = await axiosServices.get(`contact/${channelId}`, {
      params: {
        search: search || undefined,
      },
    });

    return response.data;
  }
  async markAsRead(contactId: string) {
    return axiosServices.patch(`/message/read/${contactId}`);
  }
}

export const contactService = new ContactService();
