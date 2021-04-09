async function commentFormHandler(event) {
    alert("comment clicked");
    event.preventDefault();
    let currentdate = new Date().toLocaleDateString();

    let text = document.querySelector('.comment-text').value;
   // const comment_text = document.querySelector('input[name="comment-body"]').value.trim();
    const blog_id = window.location.toString().split('/')[
        window.location.toString().split('/').length - 1
    ];
    alert(text);

    if (text) {
        const response = await fetch('/api/comments', {
            method: 'POST',
            body: JSON.stringify({ blog_id, text, currentdate }),
            headers: {
                'Content-Type': 'application/json'
            }
        });
        alert(response);


        if (response.ok) {
            alert(response.statusText);
            document.location.reload();
        } else {
            alert(response.statusText);
            document.querySelector('#comment-form').style.display = "block";
        }
    }
}
document.querySelector('.comment-form').addEventListener('submit', commentFormHandler);