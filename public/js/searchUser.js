
document.getElementById('search-users-form').addEventListener('submit', function (e) {
    e.preventDefault();
    let token = "<%=token%>"
    const username = document.getElementById('username').value;

    fetch(`/users/search?username=${encodeURIComponent(username)}`, {
        headers: {
            'Authorization': `Bearer ${token}`, // Add your token if required
        }
    })
        .then(res => res.json())
        .then(data => {
            const resultsDiv = document.getElementById('search-results');
            resultsDiv.innerHTML = ''; // Clear previous results
            console.log("users fornd kkdksd :", data.users);
            const userContainer = document.createElement('ul');
            userContainer.classList.add("list-unstyled");
            if (data.users && data.users.length > 0) {
                data.users.forEach(user => {
                    const userList = document.createElement('li');
                    userList.classList.add("user", "mb-2", "rounded", "list-group-item-primary", "list-group-item-action", "d-flex", "align-items-center", "justify-content-between")
                    userList.innerHTML = `
                  
                    <div class="d-flex align-items-center gap-2">
                    <div class="rounded-circle overflow-hidden" style="width: 60px; height: 60px;">
                      <img src="/${user.avatar_url}" class="img-fluid rounded-circle" alt="${user.username}'s avatar" width="60px" height="60px">
                    </div>
                    <div>
                     <strong class="text-white">${user.username}</strong>
                    </div>
                    </div>

                      <form action="/friends/send-request" method="POST" class="d-flex align-items-center">
                          <input type="hidden" name="receiverId" value="${user.id}">
                          <input type="hidden" name="token" value="${token}">
                          <button type="submit" style="font-size:10px;" class="btn btn-primary">Send Friend Request</button>
                      </form>
                  
                  `
                    userContainer.appendChild(userList);
                });
            } else {
                userContainer.innerHTML = `<p class="lead">No users found.</p>`;
            }
            resultsDiv.appendChild(userContainer);
        })
        .catch(err => {
            console.error('Search error:', err);
        });
});

