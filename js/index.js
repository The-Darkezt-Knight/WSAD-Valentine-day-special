document.addEventListener('DOMContentLoaded', ()=>{

    const links = document.querySelectorAll(".links");

    links.forEach(link => {
        link.addEventListener('click', (event)=> {
            event.preventDefault();
            const id = event.currentTarget.closest('.card')?.id;
            localStorage.setItem("id", id);

            if(id === "friends"){
                window.location.href = "view/main.html";
            }

            if(id === "parents") {
                const security_question = "lobaton";
                const security_answer = document.getElementById("security-question");
                const verify_btn = document.getElementById("security-btn");

                verify_btn.addEventListener('click', (event)=> {
                    const answer = security_answer.value.trim();
                    event.preventDefault();

                    if(answer === '') {
                        alert("Empty answers are not allowed");
                        return;
                    }

                    if(answer !== security_question) {
                        alert("Have you been mom-less for so long that you pretend to be my mom?!")
                        return;
                    }

                    if(answer === security_question) {
                        window.location.href = "view/mom.html";
                    }
                })
            }
        })
    })
    
})