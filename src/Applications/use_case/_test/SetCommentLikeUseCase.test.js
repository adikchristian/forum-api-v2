const SetCommentLikesUsecase = require('../SetCommentLikesUseCase');
const ThreadRepository = require('../../../Domains/threads/TheradRepository');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const LikeRepository = require('../../../Domains/likes/LikeRepository');

describe('set comments likes use case', () => {
  it('should orchestrating the set comment\'s likes action correctly', async () => {
    const userId = 'user-123';
    const threadId = 'thread-123';
    const commentId = 'comment-id';

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockLikesRepository = new LikeRepository();

    mockThreadRepository.verifyThreadAvaibility = jest.fn().mockImplementation(() => Promise.resolve());
    mockCommentRepository.verifyCommentAvaibility = jest.fn().mockImplementation(() => Promise.resolve());
    mockLikesRepository.setCommentLikes = jest.fn().mockImplementation(() => Promise.resolve());

    const setCommentLikesUseCase = new SetCommentLikesUsecase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      likeRepository: mockLikesRepository,
    });

    await setCommentLikesUseCase.execute(userId, commentId, threadId);

    expect(mockThreadRepository.verifyThreadAvaibility).toBeCalledWith(threadId);
    expect(mockCommentRepository.verifyCommentAvaibility).toBeCalledWith(commentId);
    expect(mockLikesRepository.setCommentLikes).toBeCalledWith(userId, commentId, threadId);
  });
});
