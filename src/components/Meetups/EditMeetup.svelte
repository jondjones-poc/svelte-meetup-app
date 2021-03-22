<script>
    import { createEventDispatcher} from 'svelte'
    import TextInput from '../../components/UI/TextInput.svelte'
    import Button from '../../components/UI/Button.svelte'
    import Modal from '../../components/UI/Modal.svelte';
    import { notEmpty, isValidEmail } from '../../utils/validation'
    import meetups from '../../store/meetup-store'

    export let id = null;

    let title = '';
    let subTitle = '';
    let imageUrl = '';
    let description = '';
    let address = '';
    let email = '';

    const dispatch = createEventDispatcher();

    if (id) {
        const unsubscribe = meetups.subscribe(items => {
            const meetupToEdit = items.find(item => item.id === id);
            console.log(meetupToEdit)
            title = meetupToEdit?.title;
            subTitle = meetupToEdit.subTitle;
            imageUrl = meetupToEdit.imageUrl;
            description = meetupToEdit.description;
            address = meetupToEdit.address;
            email = meetupToEdit.email;
        });

        unsubscribe();
    }

    $: titleValid = !notEmpty(title)
    $: subTitleValid = !notEmpty(subTitle);
    $: imageUrlValid = !notEmpty(imageUrl);
    $: descriptionValid = !notEmpty(description);
    $: addressValid = !notEmpty(address);
    $: emailValid = isValidEmail(email);
    $: formIsValid = titleValid && 
                        subTitleValid && 
                        addressValid && 
                        descriptionValid && 
                        imageUrlValid && 
                        emailValid;

    function submitForm()
    {
        const newMeetup = {
            title: title,
            subTitle: subTitle,
            description: description,
            address: address,
            email: email,
            imageUrl: imageUrl
        }
        if (id) {
            fetch(`https://svelte-meetup-application-default-rtdb.firebaseio.com/meetups/${id}.json`, {
                method: 'PATCH',
                body: JSON.stringify(newMeetup),
                headers: {
                    'Content-Type': 'application/json'
                }}
            ).then(result => {
                if (!result.ok) {
                    throw new Error('Fail to update meet-up data');
                }
                meetups.updateMeetup(id, newMeetup);
            }).catch(error => {
                console.log(error);
            });
        } else {
            fetch('https://svelte-meetup-application-default-rtdb.firebaseio.com/meetups.json', {
                method: 'POST',
                body: JSON.stringify({...newMeetup, isFavourite: false}),
                headers: {
                    'Content-Type': 'application/json'
                }}
            ).then(result => {
                if (!result.ok) {
                    throw new Error('Fail to add meet-up data');
                }
                console.log('Data Saved')
                meetups.addMeetup(newMeetup);
            }).catch(error => {
                console.log(error);
            });
        }

        dispatch('save');
    }

    function cancelModel() {
        dispatch('cancel');
    }

    function deleteMeetup() {
        fetch(`https://svelte-meetup-application-default-rtdb.firebaseio.com/meetups/${id}.json`, {
                method: 'DELETE'
            }).then(result => {
                if (!result.ok) {
                    throw new Error('Fail to delete meet-up data');
                }
                meetups.deleteMeetup(id);
            }).catch(error => {
                console.log(error);
            });

        dispatch('save');
    }
</script>


<style>
    form {
      width: 100%;
    }
</style>

<Modal title="Edit Modal Title" on:cancel>
    <form on:submit|preventDefault={submitForm}>
        <TextInput 
            id="title" 
            label="Title" 
            value={title}
            valid={titleValid}
            errorMessage={"Please enter a title"}
            on:input={event => (title = event.target.value)} />
            <TextInput 
            id="subtitle" 
            label="Subtitle" 
            value={subTitle}
            valid={subTitleValid}
            errorMessage={"Please enter a sub-title"}
            on:input={event => (subTitle = event.target.value)} />
        <TextInput 
            id="address" 
            label="Address" 
            value={address}
            valid={addressValid}
            errorMessage={"Please enter an address"}
            on:input={event => (address = event.target.value)} />
        <TextInput 
            id="imageUrl" 
            label="Image URL" 
            value={imageUrl}
            valid={imageUrlValid}
            errorMessage={"Please enter an image Url"}
            on:input={event => (imageUrl = event.target.value)} />
        <TextInput 
            id="email" 
            label="Email" 
            type="email"
            value={email}
            valid={emailValid}
            errorMessage={"Please enter a valid email"}
            on:input={event => (email = event.target.value)} />
        <TextInput 
            id="description" 
            label="Description" 
            controlType="textarea"
            bind:value={description}
            valid={descriptionValid}
            errorMessage={"Please enter an description"} />
    </form>
    <div slot="footer">
        <Button type="button" on:click={submitForm} disabled={!formIsValid}>
            Save
        </Button>
        {#if id}
            <Button type="button" on:click={deleteMeetup}>
                Delete
            </Button>
        {/if}
        <Button type="button" on:click={cancelModel} cssClass="outline">
            Cancel
        </Button>
    </div> 
</Modal>