const DetialsReply = require('../DetailsReply');

describe('DetailsReply entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    const payload = {
      username: 'dicoding',
      date: '2021-12-04T07:59:18.982Z',
    };
    expect(() => new DetialsReply(payload)).toThrowError('DETAILS_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    const payload = {
      id: 123,
      username: 'dicoding',
      date: 908,
      content: 'sebuah comment',
      is_deleted: 'false',
    };
    expect(() => new DetialsReply(payload)).toThrowError('DETAILS_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should print **balasan telah dihapus** if is_deleted is true', () => {
    const payload = {
      id: 'reply-123',
      username: 'dicoding',
      date: '2021-12-04T07:59:18.982Z',
      content: 'sebuah comment',
      is_deleted: true,
    };
    const detailReply = new DetialsReply(payload);
    expect(detailReply.content).toEqual('**balasan telah dihapus**');
  });

  it('should print content if is_deleted is false', () => {
    const payload = {
      id: 'reply-123',
      username: 'dicoding',
      date: '2021-12-04T07:59:18.982Z',
      content: 'sebuah comment',
      is_deleted: false,
    };
    const detailReply = new DetialsReply(payload);
    expect(detailReply.content).toEqual(payload.content);
  });

  it('should create detailReply object correctly', () => {
    const payload = {
      id: 'reply-123',
      username: 'dicoding',
      date: '2021-12-04T07:59:18.982Z',
      content: 'sebuah comment',
      is_deleted: false,
    };
    const {
      id, username, date, replies, content,
    } = new DetialsReply(payload);
    expect(id).toEqual(payload.id);
    expect(username).toEqual(payload.username);
    expect(date).toEqual(payload.date);
    expect(replies).toEqual(payload.replies);
    expect(content).toEqual(payload.content);
  });
});
