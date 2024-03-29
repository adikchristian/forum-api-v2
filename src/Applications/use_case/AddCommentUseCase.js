const AddComment = require('../../Domains/comments/entities/AddComment');

class AddCommentUseCase {
  constructor({ commentRepository, threadRepository }) {
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
  }

  async execute(useCasePayload, { owner, threadId }) {
    await this._threadRepository.verifyThreadAvaibility(threadId);

    const addComment = new AddComment(useCasePayload);
    return this._commentRepository.addCommentByThreadId(addComment, owner, threadId);
  }
}

module.exports = AddCommentUseCase;
