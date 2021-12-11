class SetCommentLikesUseCase {
  constructor({ threadRepository, commentRepository, likeRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._likeRepository = likeRepository;
  }

  async execute(userid, commentid, threadid) {
    const userId = userid;
    const commentId = commentid;
    const threadId = threadid;

    await this._threadRepository.verifyThreadAvaibility(threadId);
    await this._commentRepository.verifyCommentAvaibility(commentId);
    await this._likeRepository.setCommentLikes(userId, commentId, threadId);
  }
}

module.exports = SetCommentLikesUseCase;
