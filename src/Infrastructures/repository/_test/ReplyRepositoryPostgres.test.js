const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const ThreadTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const RepliesTableTestHelper = require('../../../../tests/RepliesTableTestHelper');
const pool = require('../../database/postgres/pool');
const ReplyRepositoryPostgres = require('../ReplyRepositoryPostgres');
const AddedReply = require('../../../Domains/replies/entities/AddedReply');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');

describe('ReplyRepositoryPostgres', () => {
  afterEach(async () => {
    await RepliesTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await ThreadTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addReplyByCommentId function', () => {
    it('should addReply when comment available', async () => {
      const owner = 'user-123';
      const commentId = 'comment-123';
      const threadId = 'thread-123';
      const payload = {
        content: 'reply',
      };

      const fakeIdGenerator = () => 123;
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, fakeIdGenerator);

      await UsersTableTestHelper.addUser({ id: owner });
      await ThreadTableTestHelper.addThread(threadId, {}, owner);
      await CommentsTableTestHelper.addComment(commentId, {}, owner, threadId);

      const addedReply = await replyRepositoryPostgres.addReplyByCommentId(payload, owner, commentId);
      const reply = await RepliesTableTestHelper.findReplyById('reply-123');

      expect(addedReply).toStrictEqual(new AddedReply({
        id: 'reply-123',
        content: payload.content,
        owner,
      }));

      expect(reply).toHaveLength(1);
      expect(reply[0].content).toBe(payload.content);
    });
  });

  describe('getReplyByThreadId function', () => {
    it('should return replies by comment', async () => {
      const owner = 'user-123';
      const commentId = 'comment-123';
      const threadId = 'thread-123';
      const payload = {
        content: 'reply',
      };

      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      await UsersTableTestHelper.addUser({ id: owner });
      await ThreadTableTestHelper.addThread(threadId, {}, owner);
      await CommentsTableTestHelper.addComment(commentId, {}, owner, threadId);
      await RepliesTableTestHelper.addReply('reply-123', payload, owner, commentId);

      const reply = await replyRepositoryPostgres.getReplyByThreadId(threadId);
      await expect(replyRepositoryPostgres.getReplyByThreadId(threadId)).resolves.not.toThrowError(NotFoundError);
      expect(reply).toHaveLength(1);
      expect(reply[0]).toHaveProperty('username');
      expect(reply[0].content).toBe(payload.content);
    });
  });

  describe('getresplyOwner', () => {
    it('should return replies owner', async () => {
      const owner = 'user-123';
      const commentId = 'comment-123';
      const threadid = 'thread-123';
      const reply = 'reply-123';
      const replyRepostoryPost = new ReplyRepositoryPostgres(pool, {});

      await UsersTableTestHelper.addUser({ id: owner });
      await ThreadTableTestHelper.addThread(threadid, {}, owner);
      await CommentsTableTestHelper.addComment(commentId, {}, owner, threadid);
      await RepliesTableTestHelper.addReply(reply, {}, owner, commentId);

      const exeReply = await replyRepostoryPost.getReplyOwner(reply);

      await expect(replyRepostoryPost.getReplyOwner(reply)).resolves.not.toThrowError(NotFoundError);
      expect(exeReply).toEqual(owner);
    });
    it('should throw NotFoundError', async () => {
      const replyRepository = new ReplyRepositoryPostgres(pool, {});
      await expect(replyRepository.getReplyOwner('reply-123')).rejects.toThrowError(NotFoundError);
    });
  });

  describe('deleteReplyById', () => {
    it('should delete replies by id', async () => {
      const owner = 'user-123';
      const commentId = 'comment-id';
      const threadId = 'thread-123';
      const replyId = 'reply-123';
      const replyRepository = new ReplyRepositoryPostgres(pool, {});

      await UsersTableTestHelper.addUser({ id: owner });
      await ThreadTableTestHelper.addThread(threadId, {}, owner);
      await CommentsTableTestHelper.addComment(commentId, {}, owner, threadId);
      await RepliesTableTestHelper.addReply(replyId, {}, owner, commentId);

      await expect(replyRepository.deleteReplyById(replyId)).resolves.not.toThrowError(NotFoundError);
    });
    it('should throw NotfoundError if replies not found', async () => {
      const replyRepository = new ReplyRepositoryPostgres(pool, {});
      await expect(replyRepository.deleteReplyById('reply-123')).rejects.toThrowError(NotFoundError);
    });
  });
});
