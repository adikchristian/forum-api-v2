const AddedReply = require('../../../Domains/replies/entities/AddedReply');
const AddReply = require('../../../Domains/replies/entities/AddReply');
const ThreadRepository = require('../../../Domains/threads/TheradRepository');
const ReplyRepository = require('../../../Domains/replies/ReplyRepository');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const AddedReplyUseCase = require('../AddReplyUseCase');

describe('AddReplyUseCase', () => {
  it('should orchestrating AddReply by commentId action correctly', async () => {
    const owner = 'user-123';
    const threadId = 'thread-123';
    const commentId = 'comment-123';

    const useCasePayload = {
      content: 'reply',
    };

    const addedReply = new AddedReply({
      id: 'reply-123',
      content: useCasePayload.content,
      owner,
    });

    const addReply = new AddReply(useCasePayload);
    const mockThreadRepository = new ThreadRepository();
    const mockReplyRepository = new ReplyRepository();
    const mockCommentRepository = new CommentRepository();

    mockThreadRepository.verifyThreadAvaibility = jest.fn().mockImplementation(() => Promise.resolve());
    mockCommentRepository.verifyCommentAvaibility = jest.fn().mockImplementation(() => Promise.resolve(commentId));
    mockReplyRepository.addReplyByCommentId = jest.fn().mockImplementation(() => Promise.resolve(addedReply));

    const getAddReplyUseCase = new AddedReplyUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
    });

    await getAddReplyUseCase.execute(addReply, { owner, commentId, threadId });
    expect(mockThreadRepository.verifyThreadAvaibility).toBeCalledWith(threadId);
    expect(mockCommentRepository.verifyCommentAvaibility).toBeCalledWith(commentId);
    expect(mockReplyRepository.addReplyByCommentId).toBeCalledWith(addReply, owner, commentId);
  });
});
