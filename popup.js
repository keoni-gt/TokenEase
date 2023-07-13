document.addEventListener('DOMContentLoaded', function() {
    chrome.storage.local.get('accs', function(result) {
        if (result && result.accs) {
          console.log(result.accs);
        } else {
          chrome.storage.local.set({ 'accs': '[]' }, function(result) {
            if (result) {
              console.log("Cookie created successfully.");
            } else {
              console.log("Failed to create cookie.");
            }
          });
        }
        chrome.storage.local.get('accs', function(result) {
            let json = []
            json = JSON.parse(result.accs)
            json = JSON.stringify(json)
            console.log(json)
            reloadAccs(json)
        })
      });


    let button = document.getElementsByClassName("login")[0]
    let tokenInput = document.getElementsByClassName("tokenLogin")[0]

    let n1 = document.getElementsByClassName("n1")[0]
    let n2 = document.getElementsByClassName("n2")[0]
    let n3 = document.getElementsByClassName("n3")[0]

    let part1 = document.getElementsByClassName("part1")[0]
    let part2 = document.getElementsByClassName("part2")[0]
    let part3 = document.getElementsByClassName("part3")[0]


    function selected(n) {
        n1.classList.remove("selected")
        n2.classList.remove("selected")
        n3.classList.remove("selected")

        part1.style.display = "none"
        part2.style.display = "none"
        part3.style.display = "none"


        if (n == "1") {
            n1.classList.add("selected")
            part1.style.display = "block"
        }

        if (n == "2") {
            n2.classList.add("selected")
            part2.style.display = "block"

        }

        if (n == "3") {
            n3.classList.add("selected")
            part3.style.display = "block"
        }

    }
    selected("1")
    n1.addEventListener("click", function() {
        selected("1")
        console.log("Selected 1")
    })

    n2.addEventListener("click", function() {
        selected("2")
        console.log("Selected 2")
    })

    n3.addEventListener("click", function() {
        selected("3")
        console.log("Selected 3")
    })


    button.addEventListener("click", function() {
        let tokenInput = document.getElementsByClassName("tokenInput")[0]
        let token = tokenInput.value
        tokenInput.value = ""


        fetch('https://discordapp.com/api/users/@me', {
            headers: {
                authorization: token
            }
        })
        .then(response => {
            let code = response.status
            console.log(code)
            console.log(response.ok)
            if (response.ok || code == 403) {
                let text = tokenInput.placeholder
                tokenInput.placeholder = "Logging in..."
                chrome.runtime.sendMessage({
                    name: 'login',
                    token: token,
                    locked: code == 403
                })
                console.log("sent")
                setTimeout(() => {
                    tokenInput.placeholder = text
                }, 4000);
            } else {
                let text = tokenInput.placeholder
                tokenInput.placeholder = "Token is invalid!"
                setTimeout(() => {
                    tokenInput.placeholder = text
                }, 1000);
            }
        })
    });

    // bet = document.getElementsByClassName("m1")[0]
    // bet.addEventListener("click", function() {
    //     tek = chrome.runtime.sendMessage({
    //         name: 'getToken',
    //     })
    // })

    // chatgpt = best
    function createAccount(username, pfp, num, userid) {
        // Create the main container div
        const div = document.createElement('div');
        div.classList.add('big');
        // Create the profile picture image element
        const img = document.createElement('img');
        img.classList.add('pfp');
        img.src = pfp;
        img.alt = '';

        // Create the username paragraph element
        const p = document.createElement('p');
        p.classList.add('user');
        p.classList.add("u"+num);
        p.classList.add(num);
        p.textContent = username;

        // Create the username paragraph element
        const id = document.createElement('p');
        id.classList.add('userid');
        id.classList.add("userid");
        id.classList.add("s"+num);
        id.textContent = userid;


        // Create the buttons container div
        const buttonsDiv = document.createElement('div');
        buttonsDiv.classList.add('buts');

        // Create the login button
        const loginButton = document.createElement('button');
        loginButton.classList.add('login2');
        loginButton.classList.add("l"+num);
        loginButton.classList.add(num);
        const loginImage = document.createElement('img');
        loginImage.src = './icons/login.svg';
        loginImage.alt = '';
        loginButton.appendChild(loginImage);

        // Create the delete button
        const deleteButton = document.createElement('button');
        deleteButton.classList.add('delete2');
        deleteButton.classList.add("d"+num);
        deleteButton.classList.add(num);

        const deleteImage = document.createElement('img');
        deleteImage.src = './icons/trash.svg';
        deleteImage.alt = '';
        deleteButton.appendChild(deleteImage);

        // Append elements to the buttons container div
        buttonsDiv.appendChild(loginButton);
        buttonsDiv.appendChild(deleteButton);

        // Append elements to the main container div
        div.appendChild(img);
        div.appendChild(p);
        div.appendChild(buttonsDiv);
        div.appendChild(id);

        // Append the main container div to the '.accs' element (replace '.accs' with your desired selector)
        const accsElement = document.querySelector('.accs');
        accsElement.appendChild(div);
      }

    function reloadAccs(js) {
        // reload all accs into the SavedAccs tab
        let noaccs = document.getElementsByClassName("noaccs")[0]
        noaccs.classList.add("none")
        let json = JSON.parse(js)
        console.log(js)
        const divsToRemove = document.querySelectorAll('div.big')
        divsToRemove.forEach(div => { div.remove() })
        if (js != "[]") {
            console.log("hi")
            let n = 0
            json.forEach(element => {
                n = parseInt(n) + 1
                if (element.discriminator != 0) {
                    createAccount(element.username+"#"+element.discriminator, element.avatar, n.toString(), element.id)
                } else {
                    createAccount(element.username, element.avatar, n.toString(), element.id)
                }
            });
        } else {
            noaccs.classList.remove("none")
        }
        refreshButs()

    }


    let sButton2 = document.getElementsByClassName("SavedButton")[0]

    sButton2.addEventListener("click", function() {
        let tokenInput = document.getElementsByClassName("SavedInput")[0]
        let token = tokenInput.value

        tokenInput.value = ""


        fetch('https://discordapp.com/api/users/@me', {
            headers: {
                authorization: token
            }
        })
        .then(response => {
            let code = response.status
            console.log(code)
            console.log(response.ok)
            if (response.ok || code == 403) {
                // console.log(response.json())
                let text = tokenInput.placeholder

                response.json().then(jsonResponse => {
                    console.log(jsonResponse)
                    let username = jsonResponse.username
                    let discriminator = jsonResponse.discriminator
                    let avatar = jsonResponse.avatar
                    let id = jsonResponse.id
                    console.log(discriminator)
                    if (discriminator != 0 && discriminator != null) {
                        if (avatar == null) {
                            // For user that has not changed updated to username update
                            // if user has no avatar its impossible to tell color of it unless we do this!
                            if (discriminator[3] == 0 || discriminator[3] == 5) { avatar = "./avatar/blurple.png"}
                            if (discriminator[3] == 1 || discriminator[3] == 6) { avatar = "./avatar/grey.png"}
                            if (discriminator[3] == 2 || discriminator[3] == 7) { avatar = "./avatar/green.png"}
                            if (discriminator[3] == 3 || discriminator[3] == 8) { avatar = "./avatar/orange.png"}
                            if (discriminator[3] == 4 || discriminator[3] == 9) { avatar = "./avatar/red.png"}
                        } else {
                            avatar = "https://cdn.discordapp.com/avatars/"+id+"/"+avatar+".png"
                        }
                    } else {
                        if (avatar == null) {
                            // couldnt find an way to get the right avatar color when user has not set one so we will make it gray temporarly
                            avatar = "./avatar/grey.png"
                        } else {
                            avatar = "https://cdn.discordapp.com/avatars/"+id+"/"+avatar+".png"
                        }
                        discriminator = 0

                    }
                    chrome.storage.local.get('accs', function(result) {
                        let json = []
                        json = JSON.parse(result.accs)

                        let exists = false

                        if (JSON.stringify(json).includes(token)) {
                            exists = true
                            tokenInput.placeholder = "Token already saved."
                            setTimeout(() => {
                                tokenInput.placeholder = text
                            }, 2000);

                        }

                        if (exists == false) {
                            json.push({
                                "username": username,
                                "discriminator": discriminator,
                                "avatar": avatar,
                                "token": token,
                                "id": id
                            })
                            tokenInput.placeholder = "Saved token."
                            json = JSON.stringify(json)
                            chrome.storage.local.set({ 'accs': json })
                            console.log(json)
                            reloadAccs(json)

                            setTimeout(() => {
                                tokenInput.placeholder = text
                            }, 2000);
                        }



                    });


                });


            } else {
                let text = tokenInput.placeholder
                tokenInput.placeholder = "Token is invalid!"
                setTimeout(() => {
                    tokenInput.placeholder = text
                }, 1000);
            }
        })
    })




    function refreshButs() {
        setTimeout(() => {
            let dB = document.getElementsByClassName("delete2");
            let lB = document.getElementsByClassName("login2");
            let us = document.getElementsByClassName("userid")
            console.log(us);

            // Remove button
            for (let n = 0; n < dB.length; n++) {
                dB[n].addEventListener("click", function(event) {
                    let number = event.target.classList[2];

                    let userid = document.getElementsByClassName("s" + number)[0].innerHTML

                    console.log(userid)
                    console.log("-----")

                    chrome.storage.local.get("accs", function(result) {
                        let oldDB = JSON.parse(result.accs)
                        let newDB = []
                        oldDB.forEach(element => {
                            if (element.id != userid) {
                                newDB.push(element)
                                console.log(element.username)
                            }
                        });
                        newDB = JSON.stringify(newDB)
                        reloadAccs(newDB)
                        chrome.storage.local.set({"accs": newDB})
                    })

                });
            }

            // Login button
            for (let n = 0; n < lB.length; n++) {
                lB[n].addEventListener("click", function(event) {
                    let number = event.target.classList[2];
                    let userid = document.getElementsByClassName("s" + number)[0].innerHTML
                    let username = document.getElementsByClassName("u" + number)[0].innerHTML
                    let pUser = document.getElementsByClassName("u" + number)[0]

                    chrome.storage.local.get('accs', function(result) {
                        let js = JSON.parse(result.accs)
                        js.forEach(element => {
                            if (element.id == userid) {
                                let token = element.token
                                console.log(token)
                                console.log("-----")

                                fetch('https://discordapp.com/api/users/@me', {
                                    headers: {
                                        authorization: token
                                    }
                                })
                                .then(response => {
                                    let code = response.status
                                    console.log(code)
                                    console.log(response.ok)
                                    if (response.ok || code == 403) {
                                        chrome.runtime.sendMessage({
                                            name: 'login',
                                            token: token,
                                            locked: null
                                        })
                                        pUser.innerHTML = "Logging in..."
                                        setTimeout(() => {
                                            pUser.innerHTML = username
                                        }, 4000);
                                    } else {
                                        pUser.innerHTML = "Invalid token, removing in 5 seconds"

                                        setTimeout(() => {
                                            chrome.storage.local.get('accs', function(result) {
                                            let json = JSON.parse(result.accs)
                                            let json2 = []
                                            json.forEach(element => {
                                                if (element.id != userid) {
                                                    json2.push(element)
                                                    console.log(element.username)
                                                }
                                            });
                                                json2 = JSON.stringify(json2)
                                                chrome.storage.local.set({ 'accs': json2}, function(result) {
                                                    console.log("saved")
                                                })
                                                reloadAccs(json2)
                                            });
                                        }, 5000)



                                    }
                                })

                            }
                        });
                    })
                })
            }

        }, 1000);
    }



    let inp1 = document.getElementsByClassName("tokenInput")[0];
    let but1 = document.getElementsByClassName("but1")[0];

    inp1.addEventListener("keydown", function(event) {
      if (event.keyCode === 13) {
        event.preventDefault()
        but1.click()
      }
    });

    let inp2 = document.getElementsByClassName("SavedInput")[0];
    let but2 = document.getElementsByClassName("but2")[0];

    inp2.addEventListener("keydown", function(event) {
      if (event.keyCode === 13) {
        event.preventDefault()
        but2.click()
      }
    });









})

