const AddReply = require('../../Domains/replies/entities/AddReply');

class AddReplyUseCase {
  constructor({ threadRepository, commentRepository, replyRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._replyRepository = replyRepository;
  }

  async execute(useCasePayload, { owner, commentId, threadId }) {
    await this._threadRepository.verifyThreadAvaibility(threadId);
    await this._commentRepository.verifyCommentAvaibility(commentId);

    const addReply = new AddReply(useCasePayload);
    return this._replyRepository.addReplyByCommentId(addReply, owner, commentId);
  }
}

module.exports = AddReplyUseCase;
