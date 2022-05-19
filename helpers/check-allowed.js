const allowed = ( user, category, ) => {
    return (user.id == category.user.id || user.role === 'ADMIN_ROLE' )
}

module.exports = {
    allowed
}