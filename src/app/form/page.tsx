function form() {
    
    const [formData,]
    return ( <div>
        <h1>Form</h1>
        <div className="flex flex-col gap-4">

            <label htmlFor="name">Name</label>
            <input type="text" id="name" name="name" placeholder="Enter your name" />

            <label htmlFor="email">Email</label>
            <input type="email" id="email" name="email" placeholder="Enter your email" />

            <label htmlFor="password">Password</label>
            <input type="password" id="password" name="password" placeholder="Enter your password" />

            <button type="submit">Submit</button>   

        </div>
    </div> );
}

export default form;