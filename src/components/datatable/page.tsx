import { useQuery } from '@tanstack/react-query'
import UsersDataTable from "./_components/users-datatable"

async function fetchUsers() {
    const response = await fetch("https://jsonplaceholder.typicode.com/users")
    if (!response.ok) throw new Error('Network response was not ok')
    return await response.json()
}



export default function DatatablePage() {
    const { data: users, isLoading, error } = useQuery({
        queryKey: ['users'],
        queryFn: fetchUsers,
    })
    if (!users) return null
    console.log(users.length)
    return (
        <>
            <UsersDataTable users={users} pageSize={5} />
        </>
    )
}