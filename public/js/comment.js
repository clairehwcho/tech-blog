const newCommentFormHandler = async (event) => {
    event.preventDefault();

    const comment = document.querySelector('#comment').value.trim();

    if (comment) {
        const response = await fetch(`/api/comments`, {
            method: 'POST',
            body: JSON.stringify({ comment }),
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (response.ok) {
            document.location.replace('/post:id');
        } else {
            alert('Failed to create comment');
        }
    }
};

document
    .querySelector('.new-comment-form')
    .addEventListener('submit', newFormHandler);


    const commentFormHandler = async function (event) {
        event.preventDefault();

        const blog_id = document.querySelector('.new-comment-form').dataset.blogid;

        const comment_description = document.querySelector('#comment_description').value.trim();

        if (comment_description) {
            await fetch('/api/comments', {
                method: 'POST',
                body: JSON.stringify({
                    blog_id,
                    comment_description,
                }),
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            document.location.reload();
        }
    };

    document
        .querySelector('.new-comment-form')
        .addEventListener('submit', commentFormHandler);